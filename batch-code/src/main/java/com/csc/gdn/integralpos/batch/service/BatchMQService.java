package com.csc.gdn.integralpos.batch.service;

import java.util.List;

import javax.batch.operations.JobRestartException;

import org.springframework.batch.core.JobParametersInvalidException;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;

import com.csc.gdn.integralpos.domain.payment.PaymentModel;

public interface BatchMQService {
	
	int getNextCountRecordsSuccessfully();
	
	int getCountRecordsSuccessfully();
	
	void launchJob() throws JobParametersInvalidException, JobExecutionAlreadyRunningException,
	JobRestartException, JobInstanceAlreadyCompleteException;
	
	boolean toggleJob();
	
	boolean toggleBatchJobState();
	
	boolean getBatchJobState();
	
	List<PaymentModel> getListPaymentsByStatus() throws Exception;
	
	String initRequest1025(PaymentModel paymentData) throws Exception;
	
	void handleResponse1025(String textMessage) throws Exception;
	
	void sendResponseQueue(String queueName, String message);
}
