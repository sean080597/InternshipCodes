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
	"insurancePolicies"
})
@XmlRootElement(name = "retrieveInsurancePoliciesResponse")
public class RetrieveInsurancePoliciesResponse {
	@XmlElement(name = "insurancePolicies")
    protected InsurancePolicies insurancePolicies;
	
	@XmlAttribute(name = "serviceId")
    protected String serviceId;
}
