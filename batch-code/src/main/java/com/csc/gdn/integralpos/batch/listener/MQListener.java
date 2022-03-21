package com.csc.gdn.integralpos.batch.listener;

import javax.jms.Message;
import javax.jms.TextMessage;

import org.owasp.security.logging.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

import com.csc.gdn.integralpos.batch.service.BatchMQService;

@Component
public class MQListener {
	
//	@Autowired
//	private BatchMQService batchMQService;
	
//    @JmsListener(destination = "${spring.ibm.mq.queueResponse}")
//    public void onMessage(Message message) {
//        SecurityUtil.logMessage("Received: " + message);
//        try {
//        	if(message instanceof TextMessage) {
//        		TextMessage textMessage = (TextMessage)message;
//        		String messageBody = textMessage.getText();
//        		SecurityUtil.logMessage("Received: " + messageBody);
////        		batchMQService.handleResponse1025(messageBody);
//        	}
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//    }
}
