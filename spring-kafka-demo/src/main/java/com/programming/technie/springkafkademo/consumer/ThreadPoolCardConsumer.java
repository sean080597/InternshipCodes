package com.programming.technie.springkafkademo.consumer;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import co.elastic.apm.api.CaptureTransaction;

@Component
public class ThreadPoolCardConsumer {
    private static Logger log = LoggerFactory.getLogger(ThreadPoolCardConsumer.class);

    @CaptureTransaction(type="messaging")
    @KafkaListener(id = "ThreadPoolCardConsumerId", topics = {"#{kafkaTopics.cardManagementTopic}"}, groupId = "NOTIFICATION", autoStartup = "true")
    @Async("kafkaThreadPool")
    public void consumeMessage(ConsumerRecord<String, String> record) throws Exception {
        log.debug("consumeCardManagementTopicMessage Key = " + record.key());
        log.debug("consumeCardManagementTopicMessage Value = " + record.value());
    }
}
