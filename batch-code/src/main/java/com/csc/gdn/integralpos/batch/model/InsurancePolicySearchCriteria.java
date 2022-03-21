package com.csc.gdn.integralpos.batch.model;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
	"insurancePolicySearchCriteriaChild"
})
@XmlRootElement(name = "insurancePolicySearchCriteria")
public class InsurancePolicySearchCriteria {
	
	@XmlElement(name = "InsurancePolicySearchCriteria")
	private InsurancePolicySearchCriteriaChild insurancePolicySearchCriteriaChild;
	
	public void setInsurancePolicySearchCriteriaChild(InsurancePolicySearchCriteriaChild value) {
		this.insurancePolicySearchCriteriaChild = value;
	}
	
	public InsurancePolicySearchCriteriaChild getInsurancePolicySearchCriteriaChild() {
		return this.insurancePolicySearchCriteriaChild;
	}
}
