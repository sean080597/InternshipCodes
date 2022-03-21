package com.csc.gdn.integralpos.batch.model;

public class EpayRecoveryModel {
	private String quoteId;
	private String paymentId;
	private MessageResponse messageReponse;
	
	public String getQuoteId() {
		return quoteId;
	}
	public void setQuoteId(String quoteId) {
		this.quoteId = quoteId;
	}
	public String getPaymentId() {
		return paymentId;
	}
	public void setPaymentId(String paymentId) {
		this.paymentId = paymentId;
	}
	public MessageResponse getMessageReponse() {
		return messageReponse;
	}
	public void setMessageReponse(MessageResponse messageReponse) {
		this.messageReponse = messageReponse;
	}
}
