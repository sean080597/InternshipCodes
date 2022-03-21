package com.csc.gdn.integralpos.batch.service;

import java.text.ParseException;
import java.util.List;
import java.util.Map;

import javax.batch.operations.JobRestartException;

import org.springframework.batch.core.JobParametersInvalidException;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;

import com.csc.gdn.integralpos.batch.model.PaymentReportModel;
import com.csc.gdn.integralpos.batch.model.ReconModel;

public interface ReconService {

	int getNextCountRecordsSuccessfully();
	
	int getCountRecordsSuccessfully();
	
	void launchJob() throws JobParametersInvalidException, JobExecutionAlreadyRunningException,
	JobRestartException, JobInstanceAlreadyCompleteException;
	
	boolean toggleJob();
	
	boolean toggleBatchJobState();
	
	boolean getBatchJobState();
	
	ReconModel save(ReconModel quote);
	
	List<ReconModel> savePaymentFile2ES();
	
	PaymentReportModel validatePaymentStatus(List<ReconModel> data) throws ParseException;
	
	String updateQuotationById(Map<String, Object> quotationData);
}
