package com.programming.technie.nats_sub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@ComponentScan(basePackages = {"com.programming.technie"})
@SpringBootApplication
public class NatsSubApplication {

	public static void main(String[] args) {
		SpringApplication.run(NatsSubApplication.class, args);
	}

}
