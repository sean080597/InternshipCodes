package com.csc.gdn.integralpos.batch.tasklet;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;

import com.csc.gdn.integralpos.batch.service.BatchQuoteService;
import com.csc.gdn.integralpos.batch.service.SummaryLogService;

public class FileWritingTasklet implements Tasklet {
	
	@Autowired
	private SummaryLogService summaryLogFile;
	
	private Log logger;
	
	public <T> FileWritingTasklet(Class<T> logName) {
		logger = LogFactory.getLog(logName);
	}
	
	@Override
	public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
		try {
			String jobName = (String) chunkContext.getStepContext().getJobParameters().get("JobName");
		} catch (Exception e) {
			// TODO: handle exception
		}
		return null;
	}
}
