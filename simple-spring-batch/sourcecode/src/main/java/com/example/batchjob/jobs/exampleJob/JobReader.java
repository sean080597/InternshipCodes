package com.example.batchjob.jobs.exampleJob;

import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.NonTransientResourceException;
import org.springframework.batch.item.ParseException;
import org.springframework.batch.item.UnexpectedInputException;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.batchjob.service.ExampleService;

public class JobReader implements ItemReader<String> {
	
	@Autowired
	private ExampleService exampleService;
	
	private int count = 0;

	@Override
	public String read() throws Exception, UnexpectedInputException, ParseException, NonTransientResourceException {
		String[] arr = exampleService.getStringArray();
		if (count < arr.length) {
			return arr[count++];
		} else {
			count = 0;
		}
		return null;
	}
}
