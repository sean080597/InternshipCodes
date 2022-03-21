package com.csc.gdn.integralpos.batch.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Data
@Configuration
@ConfigurationProperties("spring.data.elasticsearch")
public class ESProperties {
	private String host;
	private String port;
	private String clusterNodes;
	private String restClusterNodes;
	private String clusterName;
	private String userName;
	private String password;
	private int chunkSize;
	private int scrollSize;
	private int scrollTimeOut;
	private int connectTimeout;
	private int socketTimeout;
}
