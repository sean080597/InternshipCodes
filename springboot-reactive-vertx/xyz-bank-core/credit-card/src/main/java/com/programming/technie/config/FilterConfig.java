package com.programming.technie.config;

import com.programming.technie.web.filter.FishTaggingFilter;
import com.programming.technie.web.filter.LoggingFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(SecurityProperties.class)
public class FilterConfig {

    @Bean
    public FishTaggingFilter fishTaggingFilter(SecurityProperties securityProperties) {
        return new FishTaggingFilter(securityProperties.getFilter().getOrder() - 100);
    }

    @Bean
    public LoggingFilter loggingFilter(SecurityProperties securityProperties) {
        return new LoggingFilter(securityProperties.getFilter().getOrder() - 99);
    }
}
