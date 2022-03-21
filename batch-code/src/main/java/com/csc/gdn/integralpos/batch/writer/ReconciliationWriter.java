package com.csc.gdn.integralpos.batch.writer;

import java.util.Arrays;
import java.util.List;

import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.csc.gdn.integralpos.batch.constant.BatchConstants;
import com.csc.gdn.integralpos.batch.model.PaymentReportModel;
import com.csc.gdn.integralpos.batch.service.CommonBatchService;
import com.csc.gdn.integralpos.batch.utils.CSVUtils;

@Component
public class ReconciliationWriter implements ItemWriter<PaymentReportModel> {

	@Autowired
	private CommonBatchService commonBatchService;

	@Autowired
	private CSVUtils csvUtils;

	@Override
	public void write(List<? extends PaymentReportModel> reports) throws Exception {

		PaymentReportModel data = reports.get(0);
		if(data != null && data.getContent().size() != 0){
			csvUtils.extractPaymentReport(reports.get(0), Arrays.asList(
					BatchConstants.PAYMENT_REPORT_SN,
					BatchConstants.PAYMENT_REPORT_PRODUCT_CODE,
					BatchConstants.PAYMENT_REPORT_PROPOSER_NAME,
					BatchConstants.PAYMENT_REPORT_NRIC_FIN_PASSPORT,
					BatchConstants.PAYMENT_REPORT_BUSINESS_REGISTRATION_NUMBER,
					BatchConstants.PAYMENT_REPORT_QUOTATION_ID,
					BatchConstants.PAYMENT_REPORT_POLICY_NUMBER,
					BatchConstants.PAYMENT_REPORT_POLICY_ISSUANCE_DATE_TIME_STAMP,
					BatchConstants.PAYMENT_REPORT_PREMIUM_AMOUNT,
					BatchConstants.PAYMENT_REPORT_EPAY_PAYMENT_REFERENCE,
					BatchConstants.PAYMENT_REPORT_EPAY_PAYMENT_STATUS,
					BatchConstants.PAYMENT_REPORT_EPAY_PAYMENT_DATE_TIME_STAMP,
					BatchConstants.PAYMENT_REPORT_QUOTATION_CREATE_DATE_TIME_STAMP,
					BatchConstants.PAYMENT_REPORT_IFE_PAYMENT_STATUS	
				));
		}

		commonBatchService.sendEmail(data.getUuid());

		return;
	}
}
