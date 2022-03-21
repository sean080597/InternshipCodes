package com.example.batchjob.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.batchjob.service.ExampleService;
import com.example.batchjob.service.SecondService;

@RestController
@RequestMapping("/batch")
public class BatchController {

	@Autowired
	private ExampleService exampleService;
	
	@Autowired
	private SecondService secondService;
	
	@GetMapping("/invokejob")
	public String invokejob() throws Exception {
		exampleService.launchJob();
		return "Batch job has been invoked";
	}
	
	@GetMapping("/invokejob2")
	public String invokejob2() throws Exception {
		secondService.launchJob();
		return "Batch job has been invoked";
	}
}
