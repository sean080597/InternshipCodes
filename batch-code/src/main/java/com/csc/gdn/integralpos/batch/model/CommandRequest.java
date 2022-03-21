package com.csc.gdn.integralpos.batch.model;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
	"retrieveInsurancePoliciesRequest"
})
@XmlRootElement(name = "COMMAND")
public class CommandRequest {

	@XmlElement(name = "retrieveInsurancePoliciesRequest")
	private RetrieveInsurancePoliciesRequest retrieveInsurancePoliciesRequest;
	
	public void setRetrieveInsurancePoliciesRequest(RetrieveInsurancePoliciesRequest value) {
		this.retrieveInsurancePoliciesRequest = value;
	}
	
	public RetrieveInsurancePoliciesRequest getRetrieveInsurancePoliciesRequest() {
		return this.retrieveInsurancePoliciesRequest;
	}
}
