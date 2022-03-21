package com.csc.gdn.integralpos.batch.model;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlID;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.bind.annotation.adapters.CollapsedStringAdapter;
import javax.xml.bind.annotation.adapters.XmlJavaTypeAdapter;

import lombok.Data;

@Data
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "errorInfo",
    "commandResponse"
})
@XmlRootElement(name = "Message")
public class MessageResponse {
	@XmlElement(name = "ErrorInfo")
    protected ErrorInfo errorInfo;
	
	@XmlElement(name = "COMMAND")
    protected CommandResponse commandResponse;
	
    @XmlAttribute(name = "id", required = true)
    @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
    @XmlID
    @XmlSchemaType(name = "ID")
    protected String id;
    
    @XmlAttribute(name = "messageType", required = true)
    protected String messageType;
    
    @XmlAttribute(name = "company", required = true)
    protected String company;
    
    @XmlAttribute(name = "bodyType", required = true)
    protected String bodyType;
    
    @XmlAttribute(name = "timeStampCreated", required = true)
    protected String timeStampCreated;
    
    @XmlAttribute(name = "sourceLogicalId", required = true)
    protected String sourceLogicalId;
    
    @XmlAttribute(name = "destinationLogicalId", required = true)
    protected String destinationLogicalId;
    
    @XmlAttribute(name = "requestMessageRefid", required = true)
    protected String requestMessageRefid;
    
    @XmlAttribute(name = "requestMessageTimeStampReceived", required = true)
    protected String requestMessageTimeStampReceived;
    
    @XmlAttribute(name = "crfCmdMode", required = true)
    protected String crfCmdMode;
    
//    @XmlAttribute(name = "responseDateTime", required = true)
//    @XmlSchemaType(name = "dateTime")
//    protected XMLGregorianCalendar responseDateTime;
    
    @XmlAttribute(name = "version", required = true)
    protected String version;
    
    public CommandResponse getCommandResponse() {
		return commandResponse;
	}

	public void setCommandResponse(CommandResponse commandResponse) {
		this.commandResponse = commandResponse;
	}
}
