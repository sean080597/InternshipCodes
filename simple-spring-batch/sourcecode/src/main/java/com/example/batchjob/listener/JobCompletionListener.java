package com.example.batchjob.listener;

import org.owasp.security.logging.util.SecurityUtil;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.listener.JobExecutionListenerSupport;

public class JobCompletionListener extends JobExecutionListenerSupport {
	
	@Override
	public void beforeJob(JobExecution jobExecution) {
		SecurityUtil.logMessage("=============== START NEW BATCH JOB ===============");
	}

	@Override
	public void afterJob(JobExecution jobExecution) {
		if (jobExecution.getStatus() == BatchStatus.COMPLETED) {
			SecurityUtil.logMessage("BATCH JOB COMPLETED SUCCESSFULLY");
		} else if (jobExecution.getStatus() == BatchStatus.FAILED) {
			SecurityUtil.logMessage("BATCH JOB COMPLETED FAILED");
		}
	}
}
