package com.example.batchjob.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.batchjob.jobs.exampleJob.ExampleJob;

@Service("exampleService")
public class ExampleService {
	
	@Autowired
	private ExampleJob exampleJob;
	
	public void launchJob() {
		exampleJob.launchJob();
	}

	public String[] getStringArray() {
		String[] messages = { "javainuse.com",
				"Welcome to Spring Batch Example",
				"We use H2 Database for this example" };
		return messages;
	}
}
