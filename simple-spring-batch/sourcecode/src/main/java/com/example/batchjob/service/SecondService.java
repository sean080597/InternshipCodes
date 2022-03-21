package com.example.batchjob.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.batchjob.jobs.secondJob.SecondJob;

@Service("secondService")
public class SecondService {
	
	@Autowired
	private SecondJob secondJob;
	
	public void launchJob() {
		secondJob.launchJob();
	}

	public String[] getStringArray() {
		String[] messages = { "Second Job - javainuse.com",
				"Second Job - Welcome to Spring Batch Example",
				"Second Job - We use H2 Database for this example" };
		return messages;
	}
}
