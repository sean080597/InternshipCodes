package com.csc.gdn.integralpos.batch.model;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

import lombok.Data;

@Data
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
	"paymentDate",
	"status",
	"paymentReference",
	"transactionType",
	"paymentItemNo",
	"settlementDate",
	"transactionAmount"
})
@XmlRootElement(name = "lastPayment")
public class Payment {
	protected String paymentDate;
	
	@XmlElement(name = "status")
	protected Status status;
	
	protected String paymentReference;
	protected String transactionType;
	protected String paymentItemNo;
	
	@XmlElement(name = "settlementDate")
	protected SettlementDate settlementDate;
	
	@XmlElement(name = "transactionAmount")
	protected TransactionAmount transactionAmount;
}
