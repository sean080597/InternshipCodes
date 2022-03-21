package com.csc.gdn.integralpos.batch.reader;

import java.util.List;

import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.NonTransientResourceException;
import org.springframework.batch.item.ParseException;
import org.springframework.batch.item.UnexpectedInputException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.csc.gdn.integralpos.batch.service.CoverNoteService;
import com.csc.gdn.integralpos.quotation.pnc.PNCQuotationModel;

@Component
public class CoverNoteReader implements ItemReader<List<PNCQuotationModel>>{
	
	@Autowired
	private CoverNoteService coverNoteService;

	@Override
	public List<PNCQuotationModel> read() throws Exception, UnexpectedInputException, ParseException, NonTransientResourceException {
		if(!coverNoteService.getBatchJobState()){
			coverNoteService.toggleBatchJobState();
			return coverNoteService.getListQuotation();
		}
		return null;
	}
}
