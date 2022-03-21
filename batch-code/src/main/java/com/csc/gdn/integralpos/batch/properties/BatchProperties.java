package com.csc.gdn.integralpos.batch.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Data
@Configuration
@ConfigurationProperties("authentication.oauth2")
public class BatchProperties {
	private String clientId;
	private String clientSecret;
	private String server;
	private String credentialUrl;
}
