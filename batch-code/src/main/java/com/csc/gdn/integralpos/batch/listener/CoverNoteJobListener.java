package com.csc.gdn.integralpos.batch.listener;

import org.owasp.security.logging.util.SecurityUtil;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.listener.JobExecutionListenerSupport;
import org.springframework.beans.factory.annotation.Autowired;

import com.csc.gdn.integralpos.batch.service.CoverNoteService;



public class CoverNoteJobListener extends JobExecutionListenerSupport{
	@Autowired
	private CoverNoteService coverNoteService;
	
	@Override
	public void afterJob(JobExecution jobExecution) {
		// set false state to able to run job again
		coverNoteService.toggleBatchJobState();
		SecurityUtil.logMessage("Running afterJob");
		if (jobExecution.getStatus() == BatchStatus.COMPLETED) {
			SecurityUtil.logMessage("BATCH JOB COMPLETED SUCCESSFULLY");
		}else if (jobExecution.getStatus() == BatchStatus.FAILED) {
			SecurityUtil.logMessage("BATCH JOB COMPLETED FAILED");
		}
	}
}
