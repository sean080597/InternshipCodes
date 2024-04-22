package com.programming.technie.springkafkademo.consumer;

import com.programming.technie.springkafkademo.helper.KafkaParallelHelper;
import io.confluent.parallelconsumer.ParallelStreamProcessor;
import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.config.KafkaListenerEndpointRegistry;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.listener.MessageListener;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;

//@Component
public class MessageConsumer2 implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(MessageConsumer2.class);
    private static final String listenerId = "MessageConsumer2";
    private static final String topicId = "topic-demo";
    private static final String groupId = "my-group-2";

    @Autowired
    KafkaListenerEndpointRegistry registry;

    @Autowired
    ConsumerFactory<String, String> cf;

    @KafkaListener(id = "MessageConsumer2", topics = "topic-demo", autoStartup = "false")
    public void listen(ConsumerRecord<String, String> record) {
        logger.info("Consumer2 consume the message: {} - {}", record.key(), record.value());
    }

    @SuppressWarnings("unchecked")
    @Override
    public void run(ApplicationArguments args) throws Exception {
        MessageListener<String, String> messageListener = (MessageListener<String, String>) Objects.requireNonNull(registry.getListenerContainer(listenerId))
                .getContainerProperties().getMessageListener();
        Consumer<String, String> consumer = cf.createConsumer(groupId, null);
        ParallelStreamProcessor<String, String> processor = KafkaParallelHelper.genParallelConsumerOptions(consumer);
        processor.subscribe(List.of(topicId));
        processor.poll(context -> messageListener.onMessage(context.getSingleConsumerRecord(), null, consumer));
    }
}
