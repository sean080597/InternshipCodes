package com.csc.gdn.integralpos.batch.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Data
@Configuration
@ConfigurationProperties("spring.ibm.mq")
public class BatchMQProperties {
//	*** IBM MQ ***
	private String queueManager;
	private String queueRequest;
	private String queueResponse;
	private String channel;
	private String host;
	private int port;
	private String username;
	private String password;
	private long receiveTimeout;
	private String sslCipherSuite;
	private String useIBMCipherMappings;
	private String clientStorePath;
	private String clientStorePassword;
}
