package com.csc.gdn.integralpos.batch.model;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

import lombok.Data;

@Data
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
	"policyNumber",
	"proposalNumber",
	"paymentReference",
	"orderReference",
	"applicationId"
})
@XmlRootElement(name = "InsurancePolicySearchCriteria")
public class InsurancePolicySearchCriteriaChild {
	
	private String policyNumber;
	private String proposalNumber;
	private String paymentReference;
	private String orderReference;
	private String applicationId;
}
