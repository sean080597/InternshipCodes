package com.example.batchjob.service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.owasp.security.logging.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service("cmdBatchService")
public class CommandLineBatchService {
	
	@Value("${spring.batch.job.cmdEnabled}")
	private boolean cmdEnabled;
	
	@Autowired
	private ExampleService exampleService;
	
	@Autowired
	private SecondService secondService;

	public void invokeCmdLineRunner(String... args) {
		if (cmdEnabled) {
			List<String> argLs = Arrays.stream(args).collect(Collectors.toList());
			SecurityUtil.logMessage("Params ==> " + argLs);
			if (args.length > 0) {
				switch (args[0]) {
				case "exampleJob":
					exampleService.launchJob();
					break;
				case "secondJob":
					secondService.launchJob();
					break;
				default:
					break;
				}
			} else {
				SecurityUtil.logMessage("Missing some parameters");
			}
			Runtime.getRuntime().halt(0);
		}
	}
}
