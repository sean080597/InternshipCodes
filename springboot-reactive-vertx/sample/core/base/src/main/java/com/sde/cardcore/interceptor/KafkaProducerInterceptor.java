package com.xyz.cardcore.interceptor;

import java.util.Map;

import org.apache.kafka.clients.producer.ProducerInterceptor;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;

import com.xyz.ms.util.FishTagUtil;

public class KafkaProducerInterceptor implements ProducerInterceptor<String, String> {

    @Override
    public void configure(Map<String, ?> configs) {
        
    }

    @Override
    public ProducerRecord<String, String> onSend(ProducerRecord<String, String> record) {
        if (FishTagUtil.getIdFromMDC() != null) {
        	
        	if(null==record.headers().lastHeader("X-TAG-ID")) {
        		record.headers().add("X-TAG-ID", FishTagUtil.getIdFromMDC().getBytes());
        	}
            
        }
        return record;
    }

    @Override
    public void onAcknowledgement(RecordMetadata metadata, Exception exception) {
        
    }

    @Override
    public void close() {
        
    }

}
