package com.programming.technie;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.web.reactive.config.EnableWebFlux;
import reactor.blockhound.BlockHound;

import java.util.Arrays;

@EnableWebFlux
@SpringBootApplication
public class AccountApplication {

//    @Autowired
//    private ApplicationContext appContext;

    public static void main(String[] args) {
//        BlockHound.install();

        SpringApplication.run(AccountApplication.class, args);
    }

//    @Override
//    public void run(String... args) throws Exception {
//        String[] beans = appContext.getBeanDefinitionNames();
//
//        Arrays.sort(beans);
//
//        for (String bean : beans) {
//            System.out.println(bean + " of Type :: " + appContext.getBean(bean).getClass());
//        }
//    }
}