package com.example.batchjob.jobs.exampleJob;

import java.util.List;

import org.owasp.security.logging.util.SecurityUtil;
import org.springframework.batch.item.ItemWriter;

public class JobWriter implements ItemWriter<String> {

	@Override
	public void write(List<? extends String> messages) throws Exception {
		for (String msg : messages) {
			SecurityUtil.logMessage("Writing the data " + msg);
		}
	}
}
