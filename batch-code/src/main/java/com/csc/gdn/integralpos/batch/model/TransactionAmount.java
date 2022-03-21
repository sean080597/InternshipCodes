package com.csc.gdn.integralpos.batch.model;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

import lombok.Data;

@Data
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
	"theCurrencyAmount",
	"theCurrencyCode"
})
@XmlRootElement(name = "transactionAmount")
public class TransactionAmount {
	protected String theCurrencyAmount;
	protected String theCurrencyCode;
}
