package com.programming.technie.nats_pub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.ComponentScan;

@ComponentScan(basePackages = {"com.programming.technie"})
@SpringBootApplication
public class NatsPubApplication {

    private static ApplicationContext applicationContext;

    public static void main(String[] args) {
         SpringApplication.run(NatsPubApplication.class, args);
    }

    private static void checkBeansPresence(String... beans) {
        for (String beanName : beans) {
            System.out.println("Is " + beanName + " in ApplicationContext: " + applicationContext.containsBean(beanName));
        }
    }

}
