package com.csc.gdn.integralpos.batch.service;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

import javax.batch.operations.JobRestartException;

import org.apache.commons.lang3.StringUtils;
import org.elasticsearch.action.support.WriteRequest;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.action.update.UpdateResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.owasp.security.logging.util.SecurityUtil;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.JobParametersInvalidException;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.context.MessageSourceAware;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.security.core.SpringSecurityMessageSource;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import com.csc.gdn.integralpos.batch.constant.BatchConstants;
import com.csc.gdn.integralpos.batch.job.EpayRecoveryJob;
import com.csc.gdn.integralpos.batch.model.PaymentReportData;
import com.csc.gdn.integralpos.batch.model.PaymentReportModel;
import com.csc.gdn.integralpos.batch.model.ReconModel;
import com.csc.gdn.integralpos.batch.model.ReconTransModel;
import com.csc.gdn.integralpos.batch.repository.BatchQuotationRepository;
import com.csc.gdn.integralpos.batch.repository.ReconRepository;
import com.csc.gdn.integralpos.batch.utils.BatchUtils;
import com.csc.gdn.integralpos.batch.utils.ReadFileUtils;
import com.csc.gdn.integralpos.quotation.elements.IndividualInfor;
import com.csc.gdn.integralpos.quotation.pnc.PNCQuotationModel;

@Service("reconService")
public class ReconServiceImpl implements ReconService, MessageSourceAware {
	
	protected MessageSourceAccessor messages = SpringSecurityMessageSource.getAccessor();

	@Value("${spring.data.elasticsearch.scrollSize}")
	private int scrollSize;

	@Value("${spring.data.elasticsearch.scrollTimeOut}")
	private long scrollTimeOut;
	
	@Value("${reporting.input}")
	private String inputfolder;
	
	@Value("${reporting.archivefolder}")
	private String archivefolder;
	
	@Autowired
	private BatchQuotationRepository batchQuotationRepository;

	private AtomicInteger countSuccess = new AtomicInteger(0);
	private AtomicBoolean batchJobState = new AtomicBoolean(false);
	private String payDateFormat = BatchConstants.DATE_FORMAT7;
	private String polDateFormat = BatchConstants.DATE_FORMAT5;
	private String quoDateFormat = BatchConstants.DATE_FORMAT6;
	private String resDateFormat = BatchConstants.PAYMENT_REPORT_FILE_FIELD_DATE_FORMAT;

	@Autowired
	private RestHighLevelClient client;
	
	@Autowired
	private JobLauncher jobLauncher;
	
	@Autowired
	@Qualifier("reconciJob")
	private Job reconciJob;
	
	@Autowired
	private EpayRecoveryJob epayRecoveryJob;
	
	@Autowired
	private BatchUtils batchUtils;

	private ReconRepository reconRepository;

	@Autowired
	public void setBatchQuotationRepository(ReconRepository reconRepository) {
		this.reconRepository = reconRepository;
	}

	@Override
	public int getNextCountRecordsSuccessfully() {
		return countSuccess.getAndIncrement();
	}

	@Override
	public int getCountRecordsSuccessfully() {
		return countSuccess.get();
	}

	@Override
	public boolean toggleBatchJobState() {
		batchJobState.set(!batchJobState.get());
		SecurityUtil.logMessage("TOGGLED '" + batchJobState.get() + "' ON BatchJobState");
        return batchJobState.get();
	}
	
	@Override
	public boolean getBatchJobState() {
        return batchJobState.get();
	}

	@Override
	public void launchJob() throws JobParametersInvalidException, JobExecutionAlreadyRunningException,
			JobRestartException, JobInstanceAlreadyCompleteException {
		try {
			JobParameters params = new JobParametersBuilder()
					.addString("JobID", String.valueOf(System.currentTimeMillis()))
					.addString("Wish", "Pray to run successfully")
					.addString("JobName", reconciJob.getName())
					.toJobParameters();
			jobLauncher.run(reconciJob, params);
		} catch (org.springframework.batch.core.repository.JobRestartException e) {
			e.printStackTrace();
		}
	}
	
	@Override
	public boolean toggleJob() {
		return epayRecoveryJob.toggle();
	}
	
	@Override
	public void setMessageSource(MessageSource messageSource) {
		Assert.notNull("Message source must not be null");
		this.messages = new MessageSourceAccessor(messageSource);
	}
	
	@Override
	public ReconModel save(ReconModel quote) {
		return reconRepository.save(quote);
	}

	@Override
	public String updateQuotationById(Map<String, Object> quotationData) {
		try {
			UpdateRequest updateRequest = new UpdateRequest("quotation", "quotations",
					quotationData.get("id").toString());
			updateRequest.doc(quotationData);
			updateRequest.setRefreshPolicy(WriteRequest.RefreshPolicy.WAIT_UNTIL);
			UpdateResponse updateResponse = client.update(updateRequest, RequestOptions.DEFAULT);
			if (updateResponse.getId() != null) {
				return quotationData.get("id").toString();
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	@Override
	public List<ReconModel> savePaymentFile2ES() {

		List<File> filelst = ReadFileUtils.readFolder(inputfolder);
		List<ReconModel> datelst = new ArrayList<ReconModel>();
		for (File file : filelst) {
			ReconModel data = ReadFileUtils.readPaymentFile(file);
			data.setJobName(reconciJob.getName());
			data.setEndDate(new Date());
			datelst.add(data);
			save(data);
			
			//move file from INPUT folder -> ARCHIVE folder
			ReadFileUtils.moveFile(file, archivefolder);
		}
		return datelst;
	}

	@Override
	public PaymentReportModel validatePaymentStatus(List<ReconModel> data) throws ParseException {
		PaymentReportModel paymentReportModel = new PaymentReportModel();
		List<PaymentReportData> lst = new ArrayList<PaymentReportData>();
		int count = 0;

		for (ReconModel recondata : data) {
			List<ReconTransModel> lstcontent = recondata.getContent();
			for (ReconTransModel reconTransModel : lstcontent) {
				PaymentReportData report = new PaymentReportData();
				
				if(!StringUtils.equals(batchQuotationRepository.findById(reconTransModel.getOrderReference()).toString(), "Optional.empty")){
					PNCQuotationModel quoteObj = batchQuotationRepository.findById(reconTransModel.getOrderReference()).get();
					String ifePaymentStatus = validateStatus(quoteObj.getMetaData().getBusinessStatus().getCode());
					if (!StringUtils.equals(validateStatus(reconTransModel.getPaymentStatus()), ifePaymentStatus)) {
						
						String datePolStr = null, datePayStr = null, dateQuoStr = null;
						datePolStr = batchUtils.dateParserToString(quoteObj.getIssuedPolicy().getInsuredStartDate(), polDateFormat, resDateFormat);
						datePayStr = batchUtils.dateParserToString(reconTransModel.getPaymentDate(), payDateFormat, resDateFormat);
						dateQuoStr = batchUtils.dateParserToString(quoteObj.getMetaData().getCreateDate().toString(), quoDateFormat, resDateFormat);
						report.setProduct_code(quoteObj.getMetaData().getProduct().getCode());
						report.setProposer_name(quoteObj.getCoverageInfor().getProposerInfo().getBasicInformation().getName().getFullName());
						
						IndividualInfor individualInfor = quoteObj.getCoverageInfor().getProposerInfo().getBasicInformation().getIndividual();
						report.setNric(((StringUtils.isBlank(individualInfor.getNric()))?individualInfor.getPassportNo():individualInfor.getNric()));
						
						report.setBusinessRegNum(quoteObj.getCoverageInfor().getProposerInfo().getCorporateInformation().getBusinessRegis());
						report.setQuote_no(quoteObj.getMetaData().getDocName());
						report.setPol_no(reconTransModel.getPolicyNumber());
						
						report.setPol_issue_date(datePolStr);
						report.setPrem_amt(reconTransModel.getPaymentAmount());
						report.setEpay_pay_ref(reconTransModel.getPaymentReference());
						report.setEpay_pay_status(messages.getMessage("epay.payment.status."+reconTransModel.getPaymentStatus()));
						
						report.setEpay_pay_date(datePayStr);
						
						report.setQuote_create_date(dateQuoStr);
						report.setIfe_pay_status(quoteObj.getMetaData().getBusinessStatus().getDesc());
						
						lst.add(report);
					}
				} 
				count++;
				
				
			}
		}

		paymentReportModel.setContent(lst);
		return paymentReportModel;
	}

	private String validateStatus(String st) {

		String status = BatchConstants.PAYMENT_REPORT_STATUS_FAIL;
		
		if(BatchConstants.PAYMENT_REPORT_COMPLETED.contains(st)){
			status = BatchConstants.PAYMENT_REPORT_STATUS_SUCC;
		}

		return status;
	}
}
