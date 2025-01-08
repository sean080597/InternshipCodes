package com.programming.technie.nats_sub;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.aop.AopAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

import java.util.Arrays;
import java.util.List;

@SpringBootApplication(exclude = {AopAutoConfiguration.class})
//@SpringBootApplication
@ComponentScan(basePackages = {"com.programming.technie"})
public class NatsSubApplication {

    public static void main(String[] args) {
        SpringApplication.run(NatsSubApplication.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner(ApplicationContext ctx) {
        return args -> {
            System.out.println("Let's inspect the beans provided by Spring Boot:");
            String[] beanNames = ctx.getBeanDefinitionNames();
            List<String> beanLs = Arrays.stream(beanNames).sorted().toList();
            System.out.println(beanLs + "");
        };
    }
}
