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
	"moneySchedulers",
	"policyNumber",
	"paymentStatus",
	"proposalNumber"
})
@XmlRootElement(name = "LifeAndHealthPolicy")
public class LifeAndHealthPolicy {
	@XmlElement(name = "moneySchedulers")
    protected MoneySchedulers moneySchedulers;
	
	@XmlElement(name = "policyNumber")
    protected String policyNumber;
	
	@XmlElement(name = "paymentStatus")
    protected PaymentStatus paymentStatus;
	
	@XmlElement(name = "proposalNumber")
    protected String proposalNumber;
}
