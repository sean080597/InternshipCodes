package com.csc.gdn.integralpos.batch.processor;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.csc.gdn.integralpos.batch.constant.BatchConstants;
import com.csc.gdn.integralpos.batch.service.BatchQuoteService;
import com.csc.gdn.integralpos.quotation.pnc.PNCQuotationModel;

@Component
public class QuotationUpdateProcessor implements ItemProcessor<List<PNCQuotationModel>, List<PNCQuotationModel>> {
	
	@Autowired
	private BatchQuoteService batchQuoteService;
	
	private Log logger = LogFactory.getLog(QuotationUpdateProcessor.class);
	
	@Override
	public List<PNCQuotationModel> process(List<PNCQuotationModel> data) throws Exception {
		for (int i=0; i<data.size(); i++) {
			data.get(i).getMetaData().getOperationStatus().setCode(BatchConstants.EXPIRED_CODE);
			data.get(i).getMetaData().getOperationStatus().setDesc(BatchConstants.EXPIRED_DESC);
			data.get(i).getMetaData().getBusinessStatus().setCode(BatchConstants.EXPIRED_CODE);
			data.get(i).getMetaData().getBusinessStatus().setDesc(BatchConstants.EXPIRED_DESC);
			logger.info("Progress: " + (i+1)*100/data.size() + "%");
			batchQuoteService.getNextCountRecordsSuccessfully();
		}
		return data;
	}
}
