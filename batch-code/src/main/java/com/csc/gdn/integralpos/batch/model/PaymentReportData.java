package com.csc.gdn.integralpos.batch.model;

import lombok.Data;

@Data
public class PaymentReportData {
	private String sn;
	private String product_code;
	private String proposer_name;
	private String nric;
	private String businessRegNum;
	private String quote_no;
	private String pol_no;
	private String pol_issue_date;
	private String prem_amt;
	private String epay_pay_ref;
	private String epay_pay_status;
	private String epay_pay_date;
	private String quote_create_date;
	private String ife_pay_status;
	
	public PaymentReportData(String sn, String product_code, String proposer_name, String nric, String businessRegNum,
			String quote_no, String pol_no, String pol_issue_date, String prem_amt, String epay_pay_ref,
			String epay_pay_status, String epay_pay_date, String quote_create_date, String ife_pay_status) {
		super();
		this.sn = sn;
		this.product_code = product_code;
		this.proposer_name = proposer_name;
		this.nric = nric;
		this.businessRegNum = businessRegNum;
		this.quote_no = quote_no;
		this.pol_no = pol_no;
		this.pol_issue_date = pol_issue_date;
		this.prem_amt = prem_amt;
		this.epay_pay_ref = epay_pay_ref;
		this.epay_pay_status = epay_pay_status;
		this.epay_pay_date = epay_pay_date;
		this.quote_create_date = quote_create_date;
		this.ife_pay_status = ife_pay_status;
	}

	public PaymentReportData() {
	}
	
	
}
