package com.csc.gdn.integralpos.batch.reader;

import java.util.List;

import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.NonTransientResourceException;
import org.springframework.batch.item.ParseException;
import org.springframework.batch.item.UnexpectedInputException;
import org.springframework.beans.factory.annotation.Autowired;

import com.csc.gdn.integralpos.batch.service.BatchMQService;
import com.csc.gdn.integralpos.domain.payment.PaymentModel;

public class EpayRecoveryReader implements ItemReader<List<PaymentModel>> {
	
	@Autowired
	private BatchMQService batchMQService;
	
	@Override
	public List<PaymentModel> read() throws Exception, UnexpectedInputException, ParseException, NonTransientResourceException {
		if(!batchMQService.getBatchJobState()){
			batchMQService.toggleBatchJobState();
			return batchMQService.getListPaymentsByStatus();
		}
		return null;
	}
	
}
