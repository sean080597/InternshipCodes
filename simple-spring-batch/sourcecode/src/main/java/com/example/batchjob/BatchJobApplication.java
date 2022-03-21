package com.example.batchjob;

import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.example.batchjob.service.CommandLineBatchService;

@EnableScheduling
@EnableBatchProcessing
@EnableEurekaClient
@ComponentScan(basePackages = { "com.example.batchjob" })
@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })
public class BatchJobApplication implements CommandLineRunner {
	
	@Autowired
	private CommandLineBatchService cmdBatchService;

	public static void main(String[] args) {
		SpringApplication.run(BatchJobApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		cmdBatchService.invokeCmdLineRunner(args);
	}

}
