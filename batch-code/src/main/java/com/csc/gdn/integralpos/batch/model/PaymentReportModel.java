package com.csc.gdn.integralpos.batch.model;

import java.util.List;

import lombok.Data;

@Data
public class PaymentReportModel {

	private String filename;
	private String uuid;
	private List<PaymentReportData> content;

	public PaymentReportModel() {
	}

	public PaymentReportModel(String filename, String uuid, List<PaymentReportData> content) {
		super();
		this.filename = filename;
		this.uuid = uuid;
		this.content = content;
	}

}
