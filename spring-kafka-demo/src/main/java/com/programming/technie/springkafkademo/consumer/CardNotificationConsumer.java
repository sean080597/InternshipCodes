package com.sde.cardcore.card.management.consumer;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import co.elastic.apm.api.CaptureTransaction;

@Component
public class CardNotificationConsumer {
    private static Logger log = LoggerFactory.getLogger(CardNotificationConsumer.class);

    @CaptureTransaction(type="messaging")
    @KafkaListener(id = "CardNotificationConsumerId", topics = {"#{kafkaTopics.cardManagementTopic}"}, groupId = "NOTIFICATION", autoStartup = "false")
    public void consumeMessage(ConsumerRecord<String, String> record) throws Exception {
        log.debug("consumeCardManagementTopicMessage Key = " + record.key());
        log.debug("consumeCardManagementTopicMessage Value = " + record.value());
    }
}
