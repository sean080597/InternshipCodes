package com.programming.technie;

import com.xyz.modelsuite.util.StringUtil;
import org.redisson.spring.starter.RedissonAutoConfigurationV2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.reactive.config.EnableWebFlux;

@EnableWebFlux
@SpringBootApplication(exclude = {
    RedissonAutoConfigurationV2.class
})
@ComponentScan(basePackages = "com.programming.technie")
public class CreditCardApplication {

    public static void main(String[] args) {
        SpringApplication.run(CreditCardApplication.class, args);
    }
}