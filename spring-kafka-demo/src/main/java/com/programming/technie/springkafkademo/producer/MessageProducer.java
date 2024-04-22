package com.programming.technie.springkafkademo.producer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class MessageProducer {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    public void sendMessage(String topic, String message) {
        kafkaTemplate.send(topic, message).whenComplete((rs, ex) -> {
            if (ex == null) {
                System.out.println("Sent message=[" + message + "] with offset=[" + rs.getRecordMetadata().offset() + "]");
            } else {
                System.out.println("Unable to sent message=[" + message + "] due to: " + ex.getMessage());
            }
        });
    }
}
