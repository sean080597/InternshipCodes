package com.csc.gdn.integralpos.batch.processor;

import java.util.List;
import java.util.Map;

import org.codehaus.jettison.json.JSONObject;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.csc.gdn.integralpos.batch.service.CoverNoteService;
import com.csc.gdn.integralpos.quotation.pnc.PNCQuotationModel;

@Component
public class CoverNoteProcessor implements ItemProcessor<List<PNCQuotationModel>, Map<String, List<?>>>{
	
	@Autowired
	private CoverNoteService coverNoteService;
	
	@Override
	public Map<String, List<?>> process(List<PNCQuotationModel> data) throws Exception {
		return coverNoteService.processCoverNoteStatus(data);
	}
}
