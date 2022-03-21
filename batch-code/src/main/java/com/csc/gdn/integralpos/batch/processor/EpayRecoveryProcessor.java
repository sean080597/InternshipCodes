package com.csc.gdn.integralpos.batch.processor;

import java.util.ArrayList;
import java.util.List;

import org.owasp.security.logging.util.SecurityUtil;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.csc.gdn.integralpos.batch.service.BatchMQService;
import com.csc.gdn.integralpos.batch.service.BatchMQServiceImpl;
import com.csc.gdn.integralpos.domain.payment.PaymentModel;

@Component
public class EpayRecoveryProcessor implements ItemProcessor<List<PaymentModel>, List<String>> {
	
	@Autowired
	private BatchMQService batchMQService;
	
	@Override
	public List<String> process(List<PaymentModel> data) throws Exception {
		// reset list XML
		BatchMQServiceImpl.lsRequestXML.clear();
		BatchMQServiceImpl.lsResponseXML.clear();
		List<String> lsRequests = new ArrayList<String>();
		for (int i=0; i<data.size(); i++) {
			String obj = batchMQService.initRequest1025(data.get(i));
			lsRequests.add(obj);
			BatchMQServiceImpl.lsRequestXML.put(data.get(i).getReferenceInfo().getQuotationId(), obj);
			batchMQService.getNextCountRecordsSuccessfully();
			SecurityUtil.logMessage("Progress: " + (i+1)*100/data.size() + "%");
		}
		return lsRequests;
	}
}
