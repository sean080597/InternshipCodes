package com.csc.gdn.integralpos.batch.config;

import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.RestClients;
import org.springframework.data.elasticsearch.config.AbstractElasticsearchConfiguration;

import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import org.springframework.http.HttpHeaders;

import com.csc.gdn.integralpos.batch.properties.ESProperties;

@Configuration
@EnableElasticsearchRepositories(basePackages = "com.csc.gdn.integralpos.batch.repository")
public class ESConfiguration extends AbstractElasticsearchConfiguration {
	
	@Autowired
	private ESProperties esProperties;
    
	@Override
    @Bean
    public RestHighLevelClient elasticsearchClient() {
    	HttpHeaders defaultHeaders = new HttpHeaders();
   		defaultHeaders.setBasicAuth(esProperties.getUserName(), esProperties.getPassword());
   		
        final ClientConfiguration clientConfiguration = ClientConfiguration.builder()
        		.connectedTo(esProperties.getRestClusterNodes())
                .withDefaultHeaders(defaultHeaders)
                .withBasicAuth(esProperties.getUserName(), esProperties.getPassword())
                .withConnectTimeout(esProperties.getConnectTimeout())
                .withSocketTimeout(esProperties.getSocketTimeout())
                .build();
        return RestClients.create(clientConfiguration).rest();
    }
	
	@Bean
	public ResourceBundleMessageSource messageSource() {
		ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
		messageSource.setCacheSeconds(3);
		messageSource.setDefaultEncoding("UTF-8");
		messageSource.setFallbackToSystemLocale(false);
		messageSource.setBasenames("i18n/messages/descriptionMessage");
		
		return messageSource;
	}
}
