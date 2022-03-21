package com.csc.gdn.integralpos.batch.model;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

import lombok.Data;

@Data
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "errorCode",
    "errorMessageText",
    "errorState"
})
@XmlRootElement(name = "ErrorInfo")
public class ErrorInfo {
	protected String errorCode;
    protected String errorMessageText;
    protected String errorState;
    
	public String getErrorCode() {
		return errorCode;
	}
	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}
	public String getErrorMessageText() {
		return errorMessageText;
	}
	public void setErrorMessageText(String errorMessageText) {
		this.errorMessageText = errorMessageText;
	}
	public String getErrorState() {
		return errorState;
	}
	public void setErrorState(String errorState) {
		this.errorState = errorState;
	}
}
