package com.csc.gdn.integralpos.batch.service;

import java.util.List;

import javax.batch.operations.JobRestartException;

import org.springframework.batch.core.JobParametersInvalidException;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
import org.springframework.web.multipart.MultipartFile;

import com.csc.gdn.integralpos.batch.model.PostalCodeModel;

public interface PostalCodeService {
	
	int getNextCountRecordsSuccessfully();
	
	int getCountRecordsSuccessfully();
	
	void launchJob(MultipartFile files[]) throws JobParametersInvalidException, JobExecutionAlreadyRunningException,
	JobRestartException, JobInstanceAlreadyCompleteException;
	
	boolean toggleJob();
	
	boolean toggleBatchJobState();
	
	boolean getBatchJobState();
	
	void logPercent(List<PostalCodeModel> lsPostCode);
	
	PostalCodeModel save(PostalCodeModel postObj);
	
	List<PostalCodeModel> readCSVFile() throws Exception;
	
	List<PostalCodeModel> processCSVFile();
	
	void writeCSVFile(List<PostalCodeModel> lsPostCode);
}
