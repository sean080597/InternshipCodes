package com.csc.gdn.integralpos.batch.model;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

import lombok.Data;

@Data
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
	"insurancePolicySearchCriteria"
})
@XmlRootElement(name = "retrieveInsurancePoliciesRequest")
public class RetrieveInsurancePoliciesRequest {
	
	@XmlElement(name = "insurancePolicySearchCriteria")
	private InsurancePolicySearchCriteria insurancePolicySearchCriteria;
	
	@XmlAttribute(name = "serviceId")
	private String serviceId;
	
	public void setInsurancePolicySearchCriteria(InsurancePolicySearchCriteria value) {
		this.insurancePolicySearchCriteria = value;
	}
	
	public InsurancePolicySearchCriteria getInsurancePolicySearchCriteria() {
		return this.insurancePolicySearchCriteria;
	}
}
