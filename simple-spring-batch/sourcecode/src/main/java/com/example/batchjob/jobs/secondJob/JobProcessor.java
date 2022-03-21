package com.example.batchjob.jobs.secondJob;

import org.springframework.batch.item.ItemProcessor;

public class JobProcessor implements ItemProcessor<String, String> {

	@Override
	public String process(String item) throws Exception {
		return item.toUpperCase();
	}

}
