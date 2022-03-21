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
	"cardNumber",
	"expirationDate",
	"cardType",
	"brand",
	"issueBank",
	"nricType",
	"idNumber",
	"holderName",
	"tokenDetails"
})
@XmlRootElement(name = "FinancialTransactionCard")
public class FinancialTransactionCard {
	protected String cardNumber;
	protected String expirationDate;
	protected String cardType;
	protected String brand;
	protected String issueBank;
	protected String nricType;
	protected String idNumber;
	
	@XmlElement(name = "holderName")
    protected HolderName holderName;
	
	@XmlElement(name = "tokenDetails")
    protected TokenDetails tokenDetails;
}
