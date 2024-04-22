package com.programming.technie.springkafkademo.config;

import io.confluent.parallelconsumer.ParallelConsumerOptions;
import io.confluent.parallelconsumer.ParallelStreamProcessor;
import jakarta.annotation.PostConstruct;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;
import java.util.List;

//@Configuration
public class KafkaConfig {

    @Autowired
    private KafkaConsumer<String, String> kafkaConsumer;

    @Autowired
    private KafkaProducer<String, String> kafkaProducer;

    @Bean
    ParallelStreamProcessor<String, String> parallelConsumer(List<String> topics) {
        ParallelConsumerOptions<String, String> options = ParallelConsumerOptions.<String, String>builder()
                .ordering(ParallelConsumerOptions.ProcessingOrder.UNORDERED)
                .maxConcurrency(1000)
                .consumer(kafkaConsumer)
                .producer(kafkaProducer)
                .build();

        ParallelStreamProcessor<String, String> eosStreamProcessor = ParallelStreamProcessor.createEosStreamProcessor(options);

        eosStreamProcessor.subscribe(Collections.singletonList("topic-demo"));

        return eosStreamProcessor;
    }
}
