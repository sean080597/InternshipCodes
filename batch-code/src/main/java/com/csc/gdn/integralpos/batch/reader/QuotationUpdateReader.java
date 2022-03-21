package com.csc.gdn.integralpos.batch.reader;

import java.util.Date;
import java.util.List;

import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.NonTransientResourceException;
import org.springframework.batch.item.ParseException;
import org.springframework.batch.item.UnexpectedInputException;
import org.springframework.beans.factory.annotation.Autowired;

import com.csc.gdn.integralpos.batch.service.BatchQuoteService;
import com.csc.gdn.integralpos.quotation.pnc.PNCQuotationModel;

public class QuotationUpdateReader implements ItemReader<List<PNCQuotationModel>> {
	
	@Autowired
	private BatchQuoteService batchQuoteService;
	
	@Override
	public List<PNCQuotationModel> read() throws Exception, UnexpectedInputException, ParseException, NonTransientResourceException {
		if(!batchQuoteService.getBatchJobState()){
			batchQuoteService.toggleBatchJobState();
//			Date date1 = new SimpleDateFormat("yyyy-MM-dd").parse("2020-05-13");  
			return batchQuoteService.getListQuotationByDate(new Date());
		}
		return null;
	}
	
}
