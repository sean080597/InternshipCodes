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

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = { "commandRequest" })
@XmlRootElement(name = "Message")
public class MessageRequest {
	
	@XmlElement(name = "COMMAND")
	private CommandRequest commandRequest;

	@XmlAttribute(name = "id", required = true)
	@XmlJavaTypeAdapter(CollapsedStringAdapter.class)
	@XmlID
	@XmlSchemaType(name = "ID")
	private String id;

	@XmlAttribute(name = "messageType", required = true)
	private String messageType;

	@XmlAttribute(name = "company", required = true)
	private String company;

	@XmlAttribute(name = "bodyType", required = true)
	private String bodyType;

	@XmlAttribute(name = "timeStampCreated", required = true)
	private String timeStampCreated;

	@XmlAttribute(name = "sourceLogicalId", required = true)
	private String sourceLogicalId;

	@XmlAttribute(name = "destinationLogicalId", required = true)
	private String destinationLogicalId;

	@XmlAttribute(name = "crfCmdMode", required = true)
	private String crfCmdMode;

	@XmlAttribute(name = "version", required = true)
	private String version;

	public CommandRequest getCommandRequest() {
		return commandRequest;
	}

	public void setCommandRequest(CommandRequest commandRequest) {
		this.commandRequest = commandRequest;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getMessageType() {
		return messageType;
	}

	public void setMessageType(String messageType) {
		this.messageType = messageType;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public String getBodyType() {
		return bodyType;
	}

	public void setBodyType(String bodyType) {
		this.bodyType = bodyType;
	}

	public String getTimeStampCreated() {
		return timeStampCreated;
	}

	public void setTimeStampCreated(String timeStampCreated) {
		this.timeStampCreated = timeStampCreated;
	}

	public String getSourceLogicalId() {
		return sourceLogicalId;
	}

	public void setSourceLogicalId(String sourceLogicalId) {
		this.sourceLogicalId = sourceLogicalId;
	}

	public String getDestinationLogicalId() {
		return destinationLogicalId;
	}

	public void setDestinationLogicalId(String destinationLogicalId) {
		this.destinationLogicalId = destinationLogicalId;
	}

	public String getCrfCmdMode() {
		return crfCmdMode;
	}

	public void setCrfCmdMode(String crfCmdMode) {
		this.crfCmdMode = crfCmdMode;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}
}
