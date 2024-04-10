package com.programming.technie;

import com.programming.technie.config.CustomBlockHoundIntegration;
import io.vertx.core.Vertx;
import org.hibernate.reactive.mutiny.Mutiny;
import org.redisson.spring.starter.RedissonAutoConfiguration;
import org.redisson.spring.starter.RedissonAutoConfigurationV2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.aop.AopAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.reactive.config.EnableWebFlux;
import reactor.blockhound.BlockHound;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;

@EnableWebFlux
@SpringBootApplication(exclude = {
    RedissonAutoConfigurationV2.class,
})
@ComponentScan(basePackages = "com.programming.technie")
public class AccountApplication {

    public static void main(String[] args) throws Exception {
//        BlockHound.builder().with(new CustomBlockHoundIntegration()).install();
//        BlockHound.install();
//        BlockHound.install(b -> {
//            b.blockingMethodCallback(m -> {
//                new Exception("Blocking call: " + m).printStackTrace();
//            });
//        });
        SpringApplication.run(AccountApplication.class, args);

//        Mono.delay(Duration.ofSeconds(1))
//            .doOnNext(it -> {
//                try {
//                    System.out.println("Other thread started");
//                    Thread.sleep(2000);
//                    System.out.println("Other thread finished");
//                } catch (InterruptedException e) {
//                    throw new RuntimeException(e);
//                }
//            })
//            .block();
//        Thread.sleep(200);
//        System.out.println("Main thread finished");
    }

//    @Bean
//    public CommandLineRunner commandLineRunner(ApplicationContext ctx) {
//        return args -> {
//            System.out.println("Let's inspect the beans provided by Spring Boot:");
//            String[] beanNames = ctx.getBeanDefinitionNames();
//            List<String> beanLs = Arrays.stream(beanNames).sorted().toList();
//            System.out.println(beanLs + "");
//        };
//    }
}