package com.csc.gdn.integralpos.batch.service;

import java.io.StringReader;
import java.io.StringWriter;
import java.security.SecureRandom;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.batch.operations.JobRestartException;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

import org.apache.commons.codec.binary.Hex;
import org.apache.commons.lang3.StringUtils;
import org.elasticsearch.action.search.ClearScrollRequest;
import org.elasticsearch.action.search.ClearScrollResponse;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchScrollRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.Scroll;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;
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
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.csc.gdn.integralpos.batch.constant.BatchConstants;
import com.csc.gdn.integralpos.batch.job.EpayRecoveryJob;
import com.csc.gdn.integralpos.batch.model.CommandRequest;
import com.csc.gdn.integralpos.batch.model.EpayRecoveryModel;
import com.csc.gdn.integralpos.batch.model.FinancialTransactionCard;
import com.csc.gdn.integralpos.batch.model.InsurancePolicySearchCriteria;
import com.csc.gdn.integralpos.batch.model.InsurancePolicySearchCriteriaChild;
import com.csc.gdn.integralpos.batch.model.LastPayment;
import com.csc.gdn.integralpos.batch.model.LifeAndHealthPolicy;
import com.csc.gdn.integralpos.batch.model.MessageRequest;
import com.csc.gdn.integralpos.batch.model.MessageResponse;
import com.csc.gdn.integralpos.batch.model.PaymentReportData;
import com.csc.gdn.integralpos.batch.model.PaymentReportModel;
import com.csc.gdn.integralpos.batch.model.RetrieveInsurancePoliciesRequest;
import com.csc.gdn.integralpos.batch.properties.BatchMsgProperties;
import com.csc.gdn.integralpos.batch.properties.ESProperties;
import com.csc.gdn.integralpos.batch.repository.BatchPaymentRepository;
import com.csc.gdn.integralpos.batch.repository.BatchQuotationRepository;
import com.csc.gdn.integralpos.batch.utils.BatchUtils;
import com.csc.gdn.integralpos.batch.utils.CSVUtils;
import com.csc.gdn.integralpos.domain.payment.PaymentModel;
import com.csc.gdn.integralpos.quotation.elements.ProposerInfo;
import com.csc.gdn.integralpos.quotation.pnc.PNCQuotationModel;
import com.google.gson.Gson;

@Service("batchMQService")
public class BatchMQServiceImpl implements BatchMQService {

	public static Map<String, String> lsRequestXML = new HashMap<String, String>();
	public static Map<String, EpayRecoveryModel> lsResponseXML = new HashMap<String, EpayRecoveryModel>();

	private AtomicInteger countSuccess = new AtomicInteger(0);
	private Gson gson = new Gson();
	private AtomicBoolean batchJobState = new AtomicBoolean(false);
	private Map<String, String> lsSttEpay = new HashMap<String, String>();
	private String payDateFormat = BatchConstants.DATE_FORMAT4;
	private String polDateFormat = BatchConstants.DATE_FORMAT5;
	private String quoDateFormat = BatchConstants.DATE_FORMAT6;
	private String resDateFormat = BatchConstants.PAYMENT_REPORT_FILE_FIELD_DATE_FORMAT;

	@Value("${reporting.server}")
	private String apiServer;
	
	@Value("${country-code}")
	private String countryCode;

	@Autowired
	private BatchMsgProperties batchMsgProperties;

	@Autowired
	private ESProperties esProperties;

	@Autowired
	private RestHighLevelClient client;

	@Autowired
	private CommonBatchService commonBatchService;

	@Autowired
	private JobLauncher jobLauncher;
	
	@Autowired
	private JmsTemplate jmsTemplate;

	@Autowired
	@Qualifier("epayJob")
	private Job epayJob;

	@Autowired
	private EpayRecoveryJob epayRecoveryJob;

	@Autowired
	private CSVUtils csvUtils;
	
	@Autowired
	private BatchUtils batchUtils;

	private BatchPaymentRepository batchPaymentRepository;
	private BatchQuotationRepository batchQuotationRepository;

	@Autowired
	public void setBatchPaymentRepository(BatchPaymentRepository batchPaymentRepository) {
		this.batchPaymentRepository = batchPaymentRepository;
	}

	@Autowired
	public void setBatchQuotationRepository(BatchQuotationRepository batchQuotationRepository) {
		this.batchQuotationRepository = batchQuotationRepository;
	}
	
	/*
	 * Idea:
	 * + Batch Job: Save a list Request to lsRequestXML and Send to IBM MQ
	 * + MQListener: Listen on Response MQ then handle if get any Response - handleResponse1025()
	 * 
	 * How to custom:
	 * 
	 * Explain flow of BatchMQService:
	 * + Constructor:
	 * 	1/ Initial Status EPay List - lsSttEpay
	 * + Batch Job:
	 * 	+ Reader:
	 * 		1/ Get list of quotation from ES by some conditions - getListPaymentsByStatus()
	 * 	+ Processor:
	 * 		1/ Reset lsRequestXML & lsResponseXML
	 * 		2/ Initial Request List & add to lsRequestXML
	 * 	+ Writer:
	 * 		1/ Send lsRequestXML to IBM MQ
	 * 
	 * + Listener MQ:
	 * 	+ get & pass messageBody to handleResponse1025()
	 * 	+ get "status" & "quoteId" then check status to handle corresponding case
	 * 	+ compare lsRequestXML and lsResponseXML to export CSV if equals
	 * */

	// Constructor
	public BatchMQServiceImpl() {
		super();
		lsSttEpay.put(BatchConstants.PAYMENT_OPERATION_NA_CODE, BatchConstants.PAYMENT_OPERATION_NA_DESC);
		lsSttEpay.put(BatchConstants.PAYMENT_OPERATION_AUTH_CODE, BatchConstants.PAYMENT_OPERATION_AUTH_DESC);
		lsSttEpay.put(BatchConstants.PAYMENT_OPERATION_CAPTURE_CODE, BatchConstants.PAYMENT_OPERATION_CAPTURE_DESC);
		lsSttEpay.put(BatchConstants.PAYMENT_OPERATION_REFUND_CODE, BatchConstants.PAYMENT_OPERATION_REFUND_DESC);
		lsSttEpay.put(BatchConstants.PAYMENT_OPERATION_SETTLED_CODE, BatchConstants.PAYMENT_OPERATION_SETTLED_DESC);
	}

	// handle count successful records
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
					.addString("Wish", "Pray to run successfully").addString("JobName", epayJob.getName())
					.toJobParameters();
			jobLauncher.run(epayJob, params);
		} catch (org.springframework.batch.core.repository.JobRestartException e) {
			e.printStackTrace();
		}
	}

	@Override
	public boolean toggleJob() {
		return epayRecoveryJob.toggle();
	}
	
	// Reader - get list quotation by conditions
	@Override
	public List<PaymentModel> getListPaymentsByStatus() throws Exception {
		SimpleDateFormat sdf = new SimpleDateFormat(BatchConstants.DATE_FORMAT_ES);
		final Scroll scroll = new Scroll(TimeValue.timeValueSeconds(esProperties.getScrollTimeOut()));
		List<SearchHit[]> lsSearchHitArray = new ArrayList<SearchHit[]>();
		// build searchRequest
		SearchRequest searchRequest = buildSearchRequest(BatchConstants.PAYMENT_INDEX, BatchConstants.PAYMENT_TYPE);
		// create searchBuild
		SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
		// build & set query
		QueryBuilder query = QueryBuilders.boolQuery()
				.must(QueryBuilders.termQuery("metaData.operationStatus.code",
						BatchConstants.PAYMENT_OPERATION_IN_PROGRESS_CODE))
				.must(QueryBuilders.termQuery("paymentinfo.paymentType.code", BatchConstants.PAYMENT_TYPE_CREDIT_CARD))
				.must(QueryBuilders.rangeQuery("paymentinfo.epayExpiredDate").gt(sdf.format(new Date())));
		searchSourceBuilder.query(query);
		SecurityUtil.logMessage("Query: " + query.toString());
		// set size
		searchSourceBuilder.size(esProperties.getScrollSize());
		// set search builder
		searchRequest.source(searchSourceBuilder);
		// set scroll timeout
		searchRequest.scroll(scroll);
		// search response
		SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
		long totalHits = searchResponse.getHits().getTotalHits();
		SecurityUtil.logMessage("Get total:" + totalHits);
		// get scrollId
		String scrollId = searchResponse.getScrollId();
		// get first hits
		SearchHit[] searchHits = searchResponse.getHits().getHits();
		// add to list
		lsSearchHitArray.add(searchHits);
		// loop & get hits until no documents are returned
		while (searchHits != null && searchHits.length > 0) {
			// search scroll request
			SearchScrollRequest scrollRequest = new SearchScrollRequest(scrollId);
			scrollRequest.scroll(scroll);
			searchResponse = client.scroll(scrollRequest, RequestOptions.DEFAULT);
			scrollId = searchResponse.getScrollId();
			searchHits = searchResponse.getHits().getHits();
			if (searchHits.length > 0) {
				lsSearchHitArray.add(searchHits);
			}
		}
		// clear scroll request
		ClearScrollRequest clearScrollRequest = new ClearScrollRequest();
		clearScrollRequest.addScrollId(scrollId);
		ClearScrollResponse clearScrollResponse = client.clearScroll(clearScrollRequest, RequestOptions.DEFAULT);
		if (clearScrollResponse.isSucceeded()) {
			return getSearchResult(lsSearchHitArray);
		}
		return null;
	}

	private SearchRequest buildSearchRequest(String searchIndex, String searchType) {
		SearchRequest searchRequest = new SearchRequest();
		searchRequest.indices(searchIndex);
		searchRequest.types(searchType);
		return searchRequest;
	}

	private List<PaymentModel> getSearchResult(List<SearchHit[]> lsSearchHits) {
		SearchHit[] searchHits = lsSearchHits.stream().flatMap(arr -> Stream.of(arr)).toArray(SearchHit[]::new);
		List<PaymentModel> results = Arrays.stream(searchHits)
				.map(hit -> gson.fromJson(hit.getSourceAsString(), PaymentModel.class)).collect(Collectors.toList());
		return results;
	}
	// End getting list quotation

	// processor - processing list quotation
	@Override
	public String initRequest1025(PaymentModel paymentData) throws Exception {
		MessageRequest message = new MessageRequest();
		// set attribute
		message.setId(generatePaymentId());
		message.setSourceLogicalId(batchMsgProperties.getSourceLogicalId());
		message.setDestinationLogicalId(batchMsgProperties.getDestinationLogicalId());
		message.setBodyType(batchMsgProperties.getBodyType());
		message.setCompany(batchMsgProperties.getCompany());
		message.setCrfCmdMode(batchMsgProperties.getCrfCmdMode());
		message.setTimeStampCreated(generatePaymentTimestamp());
		message.setMessageType(batchMsgProperties.getMessageType());
		message.setVersion(batchMsgProperties.getVersion());
		// set command request
		message.setCommandRequest(getCommandRequest(paymentData));
		return convertObject2String(message);
	}

	private String generatePaymentId() {
		SecureRandom secRandom = new SecureRandom();
		byte[] result = new byte[3];
		secRandom.nextBytes(result);
		return batchMsgProperties.getSourceLogicalId() + "-" + generatePaymentTimestamp() + "-"
				+ Hex.encodeHexString(result);
	}

	private String generatePaymentTimestamp() {
		SimpleDateFormat sdf = new SimpleDateFormat(BatchConstants.DATE_FORMAT_TIMESTAMP);
		return sdf.format(new Date());
	}

	private CommandRequest getCommandRequest(PaymentModel paymentData) {
		CommandRequest obj = new CommandRequest();
		RetrieveInsurancePoliciesRequest objRetrieve = new RetrieveInsurancePoliciesRequest();
		InsurancePolicySearchCriteria objInsurance = new InsurancePolicySearchCriteria();
		InsurancePolicySearchCriteriaChild objInsuranceChild = new InsurancePolicySearchCriteriaChild();

		objInsuranceChild.setPolicyNumber("");
		objInsuranceChild.setProposalNumber(paymentData.getReferenceInfo().getQuotationId());
		objInsuranceChild.setPaymentReference("");
		objInsuranceChild.setOrderReference(paymentData.getReferenceInfo().getQuotationId());
		objInsuranceChild.setApplicationId(batchMsgProperties.getApplicationId());
		objInsurance.setInsurancePolicySearchCriteriaChild(objInsuranceChild);
		objRetrieve.setServiceId(batchMsgProperties.getServiceId());
		objRetrieve.setInsurancePolicySearchCriteria(objInsurance);
		obj.setRetrieveInsurancePoliciesRequest(objRetrieve);
		return obj;
	}

	private String convertObject2String(MessageRequest message) throws JAXBException {
		JAXBContext context = JAXBContext.newInstance(MessageRequest.class);
		Marshaller jaxbMarshaller = context.createMarshaller();
		jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, false);
		StringWriter sw = new StringWriter();
		jaxbMarshaller.marshal(message, sw);
		return sw.toString();
	}
	// end processing list quotation

	// Writer - handle response cases
	// handle response
	@Override
	public void handleResponse1025(String textMessage) throws Exception {
		MessageResponse msg = getMessageResponse(textMessage);
		String status = msg.getCommandResponse().getRetrieveInsurancePoliciesResponse().getInsurancePolicies()
				.getLifeAndHealthPolicy().getPaymentStatus().getPaymentStatusChild().getState().getEnumeration()
				.getDescription();
		String quoteId = msg.getCommandResponse().getRetrieveInsurancePoliciesResponse().getInsurancePolicies()
				.getLifeAndHealthPolicy().getProposalNumber();
		SecurityUtil.logMessage("Got quoteId = " + quoteId + " - status = " + status);
		if (StringUtils.isNotBlank(quoteId) && StringUtils.isNotBlank(status)) {
			// get quotation & payment record
			EpayRecoveryModel epayRecoveryModel = new EpayRecoveryModel();
			PNCQuotationModel quoteObj = batchQuotationRepository.findById(quoteId).get();
			String paymentId = quoteObj.getReferenceInfo().getPaymentId();
			PaymentModel paymentObj = batchPaymentRepository.findById(paymentId).get();
			epayRecoveryModel.setQuoteId(quoteId);
			epayRecoveryModel.setPaymentId(paymentId);
			epayRecoveryModel.setMessageReponse(msg);
			// check status
			switch (status) {
			case BatchConstants.PAYMENT_OPERATION_COMPLETED_CODE:
				handleCompleted1025(quoteObj, paymentObj, epayRecoveryModel);
				break;
			default:
				handleNothing1025(paymentObj, status);
				break;
			}
		}
		// check to save csv & send mail
		if (lsRequestXML.size() == lsResponseXML.size()) {
			// export csv & send mail
			PaymentReportModel reportModel = handleInitReportModel(lsResponseXML);
			if (!Objects.isNull(reportModel)) {
				csvUtils.extractPaymentReport(reportModel, handleInitHeaderReport());
				commonBatchService.sendEmail(reportModel.getUuid());
			}

			// clear lsRequestXML & lsResponseXML
			lsRequestXML.clear();
			lsResponseXML.clear();
		}
	}
	
	private MessageResponse getMessageResponse(String resXmlString) throws JAXBException {
		JAXBContext jaxbContext = JAXBContext.newInstance(MessageResponse.class);
		Unmarshaller unmarshaller = jaxbContext.createUnmarshaller();
		StringReader reader = new StringReader(resXmlString);
		return (MessageResponse) unmarshaller.unmarshal(reader);
	}
	
	// handle cases
	private void handleCompleted1025(PNCQuotationModel quoteObj, PaymentModel paymentObj,
			EpayRecoveryModel epayRecoveryModel) throws Exception {
		SecurityUtil.logMessage("Before handle completed 1025");
		// update payment & quotation status in ES
		updateCompletedQuotation(quoteObj);
		String mobileNumber = quoteObj.getCoverageInfor().getProposerInfo().getContacts().get(0).getMobileNumber();
		updateCompletedPayment(paymentObj, epayRecoveryModel, mobileNumber);
		// call get policyNumber
		boolean isSuccess = callPolicyNumber(quoteObj);
		// add to response list
		if (lsRequestXML.containsKey(epayRecoveryModel.getQuoteId())) {
			lsResponseXML.put(epayRecoveryModel.getQuoteId(), epayRecoveryModel);
		}
		SecurityUtil.logMessage("After handle completed 1025");
	}

	private void handleNothing1025(PaymentModel paymentObj, String status) {
		String stt = lsSttEpay.get(status);
		SecurityUtil.logMessage("Status to change ==> code = " + status + " - desc = " + stt);
		paymentObj.getMetaData().getOperationStatus().setCode(status);
		paymentObj.getMetaData().getOperationStatus().setDesc(stt);
		SecurityUtil.logMessage("Saved payment status");
		batchPaymentRepository.save(paymentObj);
	}
	
	private void updateCompletedPayment(PaymentModel paymentObj, EpayRecoveryModel epayRecoveryModel, String mobileNumber) throws Exception {
		// get paymentInfo
		FinancialTransactionCard finanObj = epayRecoveryModel.getMessageReponse().getCommandResponse().getRetrieveInsurancePoliciesResponse()
				.getInsurancePolicies().getLifeAndHealthPolicy().getMoneySchedulers().getMoneyInScheduler()
				.getPaymentMethod().getPaymentMethodChild().getFinancialTransactionMedium().getFinancialTransactionCard();
		String cardNumber = finanObj.getCardNumber();
		String cardType = finanObj.getCardType();
		String cardName = finanObj.getHolderName().getPersonName().getFullName();
		int cardExpiryMonth = Integer.valueOf(finanObj.getExpirationDate().substring(0, 3));
		int cardExpiryYear = Integer.valueOf(finanObj.getExpirationDate().substring(3));
		
		LastPayment lastPaymentObj = epayRecoveryModel.getMessageReponse().getCommandResponse().getRetrieveInsurancePoliciesResponse()
				.getInsurancePolicies().getLifeAndHealthPolicy().getMoneySchedulers().getMoneyInScheduler().getLastPayment();
		String transactionNumber = lastPaymentObj.getPayment().getPaymentReference();
		
		String paymentDateStr = lastPaymentObj.getPayment().getPaymentDate();
		Date paymentDate = batchUtils.dateParserToDate(paymentDateStr, BatchConstants.DATE_FORMAT4);
		
		// update paymentInfo
		paymentObj.getPaymentinfo().getPaymentAmount().getPayments().get(0).getPaymentMethod().getCreditCard().setCardNumber(cardNumber);
		paymentObj.getPaymentinfo().getPaymentAmount().getPayments().get(0).getPaymentMethod().getCreditCard().setCardType(cardType);
		paymentObj.getPaymentinfo().getPaymentAmount().getPayments().get(0).getPaymentMethod().getCreditCard().setCardName(cardName);
		paymentObj.getPaymentinfo().getPaymentAmount().getPayments().get(0).getPaymentMethod().getCreditCard().setCardExpiryMonth(cardExpiryMonth);
		paymentObj.getPaymentinfo().getPaymentAmount().getPayments().get(0).getPaymentMethod().getCreditCard().setCardExpiryYear(cardExpiryYear);
		
		paymentObj.getPaymentinfo().getPaymentAmount().getPayments().get(0).setReferenceNumber(transactionNumber);
		paymentObj.getPaymentinfo().getPaymentAmount().getPayments().get(0).setPaymentDate(paymentDate);
		paymentObj.getPaymentinfo().getPaymentAmount().getPayments().get(0).setWebIssueDate(paymentDateStr.substring(0, 8));
		paymentObj.getPaymentinfo().getPaymentAmount().getPayments().get(0).setWebIssueTime(paymentDateStr.substring(8));
		
		paymentObj.getMetaData().getOperationStatus().setCode(BatchConstants.PAYMENT_OPERATION_COMPLETED_CODE);
		paymentObj.getMetaData().getOperationStatus().setDesc(BatchConstants.PAYMENT_OPERATION_COMPLETED_DESC);
		paymentObj.getMetaData().getBusinessStatus().setCode(BatchConstants.PAYMENT_BUSINESS_COMPLETED_CODE);
		paymentObj.getMetaData().getBusinessStatus().setDesc(BatchConstants.PAYMENT_BUSINESS_COMPLETED_DESC);
		
		paymentObj.getPayer().setPayorName(cardName);
		paymentObj.getPayer().getPerson().getContacts().get(0).getPhoneNo().setNumber(mobileNumber);
		paymentObj.getPayer().getPerson().getAddresses().get(0).setCountryCode(countryCode);
		
		batchPaymentRepository.save(paymentObj);
	}

	private void updateCompletedQuotation(PNCQuotationModel quoteObj) {
		quoteObj.getMetaData().getOperationStatus().setCode(BatchConstants.PAYMENT_COMPLETE_CODE);
		quoteObj.getMetaData().getOperationStatus().setDesc(BatchConstants.PAYMENT_COMPLETE_DESC);
		quoteObj.getMetaData().getBusinessStatus().setCode(BatchConstants.COMPLETE_CODE);
		quoteObj.getMetaData().getBusinessStatus().setDesc(BatchConstants.COMPLETE_DESC);
		batchQuotationRepository.save(quoteObj);
	}

	// calling submit policy issued
	private boolean callPolicyNumber(PNCQuotationModel quoteObj) {
		String requestUri = apiServer + BatchConstants.URL_PRESUBMIT_QUOTATION;
		List<String> params = new ArrayList<>();
		params.add(quoteObj.getMetaData().getBusinessType().getCode());
		params.add(quoteObj.getMetaData().getProduct().getCode());
		params.add(quoteObj.getId());
		params.add(quoteObj.getMetaData().getAgentId());
		String runtimeURL = commonBatchService.setURIParameter(requestUri, params);
		SecurityUtil.logMessage("Call submit Policy 1025 - url = " + runtimeURL);
		Map<String, String> obj = WebClient.builder()
				.filter(commonBatchService.oauth2Credentials(commonBatchService.getApplicationToken())).build().post()
				.uri(runtimeURL).retrieve().bodyToMono(Map.class).block();
		return StringUtils.isNotBlank(obj.get("proposalNumber")) ? true : false;
	}

	// handle export csv
	private PaymentReportModel handleInitReportModel(Map<String, EpayRecoveryModel> lsData) {
		PaymentReportModel paymentReportModel = new PaymentReportModel();
		List<PaymentReportData> lsReportData = new ArrayList<PaymentReportData>();
		lsData.forEach((key, value) -> {
			// prepare value
			PNCQuotationModel quoteObj = batchQuotationRepository.findById(value.getQuoteId()).get();
			PaymentModel paymentObj = batchPaymentRepository.findById(value.getPaymentId()).get();
			MessageResponse msgObj = value.getMessageReponse();
			ProposerInfo proposerObj = quoteObj.getCoverageInfor().getProposerInfo();
			LifeAndHealthPolicy lifeObj = msgObj.getCommandResponse().getRetrieveInsurancePoliciesResponse()
					.getInsurancePolicies().getLifeAndHealthPolicy();
			String epayStatusCode = lifeObj.getPaymentStatus().getPaymentStatusChild().getState().getEnumeration()
					.getDescription();
			String epayStatusDesc = lsSttEpay.get(epayStatusCode);
			String recoveredStatus = epayStatusCode.equals(BatchConstants.PAYMENT_OPERATION_SETTLED_CODE) ? BatchConstants.EPAY_RECOVERED : BatchConstants.EPAY_NO_ACTION;
			
			String datePolStr = null, datePayStr = null, dateQuoStr = null;
			try {
				datePolStr = batchUtils.dateParserToString(quoteObj.getIssuedPolicy().getInsuredStartDate(), polDateFormat, resDateFormat);
				datePayStr = batchUtils.dateParserToString(lifeObj.getMoneySchedulers().getMoneyInScheduler().getLastPayment().getPayment().getPaymentDate(), payDateFormat, resDateFormat);
				dateQuoStr = batchUtils.dateParserToString(quoteObj.getMetaData().getCreateDate().toString(), quoDateFormat, resDateFormat);
			} catch (ParseException e) {
				e.printStackTrace();
			}

			// set value
			PaymentReportData reportData = new PaymentReportData();
			reportData.setProduct_code(quoteObj.getMetaData().getProduct().getCode());
			reportData.setProposer_name("");
			reportData.setNric(proposerObj.getBasicInformation().getIndividual().getNric());
			reportData.setBusinessRegNum(proposerObj.getCorporateInformation().getBusinessRegis());
			reportData.setQuote_no(quoteObj.getMetaData().getDocName());
			reportData.setPol_no(quoteObj.getMetaData().getPolicyNo());
			reportData.setPol_issue_date(datePolStr);
			reportData.setPrem_amt(paymentObj.getPaymentinfo().getPaymentAmount().getNetAmount().getAmount().toString());
			reportData.setEpay_pay_ref(lifeObj.getMoneySchedulers().getMoneyInScheduler().getLastPayment().getPayment().getPaymentReference());
			reportData.setEpay_pay_status(epayStatusDesc);
			reportData.setEpay_pay_date(datePayStr);
			reportData.setQuote_create_date(dateQuoStr);
			reportData.setIfe_pay_status(recoveredStatus);

			// add to list
			lsReportData.add(reportData);
		});
		paymentReportModel.setContent(lsReportData);
		return paymentReportModel;
	}

	// init Header Report
	private List<String> handleInitHeaderReport() {
		return Arrays.asList(BatchConstants.PAYMENT_REPORT_SN, BatchConstants.PAYMENT_REPORT_PRODUCT_CODE,
				BatchConstants.PAYMENT_REPORT_PROPOSER_NAME, BatchConstants.PAYMENT_REPORT_NRIC_FIN_PASSPORT,
				BatchConstants.PAYMENT_REPORT_BUSINESS_REGISTRATION_NUMBER, BatchConstants.PAYMENT_REPORT_QUOTATION_ID,
				BatchConstants.PAYMENT_REPORT_POLICY_NUMBER,
				BatchConstants.PAYMENT_REPORT_POLICY_ISSUANCE_DATE_TIME_STAMP,
				BatchConstants.PAYMENT_REPORT_PREMIUM_AMOUNT, BatchConstants.PAYMENT_REPORT_EPAY_PAYMENT_REFERENCE,
				BatchConstants.PAYMENT_REPORT_EPAY_PAYMENT_STATUS,
				BatchConstants.PAYMENT_REPORT_EPAY_PAYMENT_DATE_TIME_STAMP,
				BatchConstants.PAYMENT_REPORT_RECOVERED_DATE_TIME_STAMP,
				BatchConstants.PAYMENT_REPORT_RECOVERED_STATUS);
	}
	
	// handle send response message MQ
	@Override
	public void sendResponseQueue(String queueName, String message) {
		jmsTemplate.convertAndSend(queueName, message);
	}
}
