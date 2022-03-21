package com.csc.gdn.integralpos.batch.model;

import lombok.Data;

@Data
public class ReconTransModel {
	
	private String originalData;
	private String recordIndicator;
	private String paymentReference;
	private String orderReference;
	private String policyNumber;
	private String proposalNumber;
	private String paymentDate;
	private String paymentItemNumber;
	private String paymentMethod;
	private String paymentAmount;
	private String paymentStatus;
	private String tokenValue;
	private String creditCardNumber;
	private String payerEmailid;
	private String payerMobile;
	private String pvCode;
	private String pvActualAmount;
	private String pvUsedAmount;
	private String pvUsedDate;
	private String pvTransactionID;
	private String voucherStatus;
	
}
