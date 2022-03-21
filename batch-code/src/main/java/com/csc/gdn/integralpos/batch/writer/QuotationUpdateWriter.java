package com.csc.gdn.integralpos.batch.writer;

import java.util.List;

import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.csc.gdn.integralpos.batch.service.BatchQuoteService;
import com.csc.gdn.integralpos.quotation.pnc.PNCQuotationModel;

@Component
public class QuotationUpdateWriter implements ItemWriter<List<PNCQuotationModel>> {

	@Autowired
	private BatchQuoteService batchQuoteService;
	
	@Override
	public void write(List<? extends List<PNCQuotationModel>> data) throws Exception {
		if(data.size() > 0) {			
			List<PNCQuotationModel> resData = data.get(0);
			for (PNCQuotationModel quote : resData) {
				batchQuoteService.save(quote);
			}
		}
		return;
	}
}
