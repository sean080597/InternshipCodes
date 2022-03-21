package com.csc.gdn.integralpos.batch.listener;

import org.owasp.security.logging.util.SecurityUtil;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.listener.JobExecutionListenerSupport;
import org.springframework.beans.factory.annotation.Autowired;

import com.csc.gdn.integralpos.batch.service.PostalCodeService;

public class PostalCodeJobListener extends JobExecutionListenerSupport{
	@Autowired
	private PostalCodeService postalCodeService;
	
	@Override
	public void afterJob(JobExecution jobExecution) {
		// set false state to able to run job again
		postalCodeService.toggleBatchJobState();
		SecurityUtil.logMessage("Running afterJob");
		if (jobExecution.getStatus() == BatchStatus.COMPLETED) {
			SecurityUtil.logMessage("BATCH JOB COMPLETED SUCCESSFULLY");
		}else if (jobExecution.getStatus() == BatchStatus.FAILED) {
			SecurityUtil.logMessage("BATCH JOB COMPLETED FAILED");
		}
	}
}
