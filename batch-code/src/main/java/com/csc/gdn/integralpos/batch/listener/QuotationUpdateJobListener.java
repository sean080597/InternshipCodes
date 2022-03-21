package com.csc.gdn.integralpos.batch.listener;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.listener.JobExecutionListenerSupport;
import org.springframework.beans.factory.annotation.Autowired;

import com.csc.gdn.integralpos.batch.service.BatchQuoteService;

public class QuotationUpdateJobListener extends JobExecutionListenerSupport{
	
	@Autowired
	private BatchQuoteService batchQuoteService;
	
	private Log logger;
	
	public <T> QuotationUpdateJobListener(Class<T> logName) {
		logger = LogFactory.getLog(logName);
	}
	
	@Override
	public void afterJob(JobExecution jobExecution) {
		// set false state to able to run job again
		batchQuoteService.toggleBatchJobState();
		logger.info("Running afterJob");
		if (jobExecution.getStatus() == BatchStatus.COMPLETED) {
			logger.info("BATCH JOB COMPLETED SUCCESSFULLY");
		}else if (jobExecution.getStatus() == BatchStatus.FAILED) {
			logger.error("BATCH JOB COMPLETED FAILED");
		}
	}
}
