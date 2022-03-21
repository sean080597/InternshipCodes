package com.csc.gdn.integralpos.batch.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Data
@Configuration
@ConfigurationProperties("epay.message-header")
public class BatchMsgProperties {
	private String serverUri;
	private String version;
	private String company;
	private String bodyType;
	private String sourceLogicalId;
	private String destinationLogicalId;
	private String crfCmdMode;
	private String messageType;
	private String serviceId;
	private String applicationId;
}
