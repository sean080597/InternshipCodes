package com.programming.technie;

import io.netty.util.concurrent.FastThreadLocalThread;
import org.redisson.spring.starter.RedissonAutoConfigurationV2;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cglib.core.Block;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.reactive.config.EnableWebFlux;
import reactor.blockhound.BlockHound;
import reactor.core.publisher.Mono;

import java.time.Duration;

@EnableWebFlux
@SpringBootApplication(exclude = {
//    RedissonAutoConfigurationV2.class,
})
@ComponentScan(basePackages = "com.programming.technie")
public class InternetApplication {
    public static void main(String[] args) throws InterruptedException {
//        BlockHound.install();
//        BlockHound.install(builder -> builder.nonBlockingThreadPredicate(p -> thread -> !thread.getName().contains("redisson") && p.test(thread)));
        BlockHound.install(builder -> builder.nonBlockingThreadPredicate(p -> thread -> !(thread instanceof FastThreadLocalThread) && p.test(thread)));

        SpringApplication.run(InternetApplication.class, args);

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
}