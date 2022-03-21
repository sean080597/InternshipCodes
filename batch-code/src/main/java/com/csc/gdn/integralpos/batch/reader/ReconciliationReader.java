package com.csc.gdn.integralpos.batch.reader;

import java.util.List;

import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.NonTransientResourceException;
import org.springframework.batch.item.ParseException;
import org.springframework.batch.item.UnexpectedInputException;
import org.springframework.beans.factory.annotation.Autowired;

import com.csc.gdn.integralpos.batch.service.ReconService;
import com.csc.gdn.integralpos.batch.model.ReconModel;

public class ReconciliationReader implements ItemReader<List<ReconModel>> {
	
	@Autowired
	private ReconService reconService;
	
	@Override
	public List<ReconModel> read() throws Exception, UnexpectedInputException, ParseException, NonTransientResourceException {
		if(!reconService.getBatchJobState()){
			reconService.toggleBatchJobState();
			return reconService.savePaymentFile2ES();
		}
		return null;
	}
	
}
