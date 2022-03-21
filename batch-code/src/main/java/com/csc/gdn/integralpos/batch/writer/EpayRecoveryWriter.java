package com.csc.gdn.integralpos.batch.writer;

import java.util.List;

import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

import com.csc.gdn.integralpos.batch.properties.BatchMQProperties;

@Component
public class EpayRecoveryWriter implements ItemWriter<List<String>> {
	
	@Autowired
	private JmsTemplate jmsTemplate;
	
	@Autowired
	private BatchMQProperties batchMQProperties;
	
	@Override
	public void write(List<? extends List<String>> data) throws Exception {
		if(data.size() > 0) {			
			List<String> resData = data.get(0);
			for (String paymentData : resData) {
				jmsTemplate.convertAndSend(batchMQProperties.getQueueRequest(), paymentData);
			}
		}
		return;
	}
}
