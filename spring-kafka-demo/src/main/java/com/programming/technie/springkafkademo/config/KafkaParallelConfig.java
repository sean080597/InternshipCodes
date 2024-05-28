package com.programming.technie.springkafkademo.config;

import com.programming.technie.springkafkademo.helper.KafkaParallelHelper;
import io.confluent.parallelconsumer.ParallelStreamProcessor;
import org.apache.kafka.clients.consumer.Consumer;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.KafkaListenerEndpointRegistry;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.listener.MessageListener;

import java.util.Arrays;
import java.util.Objects;

@Configuration
public class KafkaParallelConfig {

    @SuppressWarnings("unchecked")
    @Bean
    ApplicationRunner runner(KafkaListenerEndpointRegistry registry, @Qualifier("parallelConsumerFactory") ConsumerFactory<String, String> cf) {
        return args -> registry.getAllListenerContainers().stream().filter(container -> !container.isAutoStartup()).forEach(container -> {
            MessageListener<String, String> messageListener = (MessageListener<String, String>) container.getContainerProperties().getMessageListener();
            Consumer<String, String> consumer = cf.createConsumer(container.getGroupId(), container.getContainerProperties().getClientId());
            ParallelStreamProcessor<String, String> processor = KafkaHelper.genParallelConsumerOptions(consumer);
            processor.subscribe(Arrays.asList(Objects.requireNonNull(container.getContainerProperties().getTopics())));
            processor.poll(context -> messageListener.onMessage(context.getSingleConsumerRecord(), null, consumer));
        });
    }
}
