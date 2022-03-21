package com.example.batchjob.jobs.secondJob;

import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.NonTransientResourceException;
import org.springframework.batch.item.ParseException;
import org.springframework.batch.item.UnexpectedInputException;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.batchjob.service.SecondService;

public class JobReader implements ItemReader<String> {
	
	@Autowired
	private SecondService secondService;
	
	private int count = 0;

	@Override
	public String read() throws Exception, UnexpectedInputException, ParseException, NonTransientResourceException {
		String[] arr = secondService.getStringArray();
		if (count < arr.length) {
			return arr[count++];
		} else {
			count = 0;
		}
		return null;
	}
}
