package com.csc.gdn.integralpos.batch.service;

import java.util.List;
import java.util.Map;

import javax.batch.operations.JobRestartException;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.batch.core.JobParametersInvalidException;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;

import com.csc.gdn.integralpos.quotation.pnc.PNCQuotationModel;

public interface CoverNoteService {
	
	int getNextCountRecordsSuccessfully();
	
	int getCountRecordsSuccessfully();
	
	void launchJob() throws JobParametersInvalidException, JobExecutionAlreadyRunningException,
	JobRestartException, JobInstanceAlreadyCompleteException;
	
	boolean toggleJob();
	
	boolean toggleBatchJobState();
	
	boolean getBatchJobState();
	
	PNCQuotationModel save(PNCQuotationModel postObj);
	
	List<PNCQuotationModel> getListQuotation() throws Exception;
	
	Map<String, List<? extends Object>> processCoverNoteStatus(List<PNCQuotationModel> lsCoverNote) throws Exception;
	
	void handleResponseCasesList(Map<String, List<? extends Object>> responseObj2Compare) throws Exception;
	
	void triggerPXSendMail(String quoteId);
//	Map<String, Object> genRequestCoverNoteList(List<PNCQuotationModel> lsCoverNote) throws Exception;
//	JSONObject callJPJService(Map<String, Object> requestObj) throws JSONException;
}
