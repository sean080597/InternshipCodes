package com.csc.gdn.integralpos.batch.service;

import java.util.Date;
import java.util.List;

import javax.batch.operations.JobRestartException;

import org.springframework.batch.core.JobParametersInvalidException;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;

import com.csc.gdn.integralpos.quotation.pnc.PNCQuotationModel;

public interface BatchQuoteService {
	
	int getNextCountRecordsSuccessfully();
	
	int getCountRecordsSuccessfully();
	
	void launchJob() throws JobParametersInvalidException, JobExecutionAlreadyRunningException,
	JobRestartException, JobInstanceAlreadyCompleteException;
	
	boolean toggleJob();
	
	boolean toggleBatchJobState();
	
	boolean getBatchJobState();
	
	PNCQuotationModel save(PNCQuotationModel quote);
	
	List<PNCQuotationModel> getListQuotationByDate(Date date) throws Exception;

	void doLogWrite(String name, String fileFolder, String content);
}
