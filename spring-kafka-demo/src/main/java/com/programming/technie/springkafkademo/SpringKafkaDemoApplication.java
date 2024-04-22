package com.programming.technie.springkafkademo;

import io.confluent.parallelconsumer.ParallelConsumerOptions;
import io.confluent.parallelconsumer.ParallelStreamProcessor;
import io.confluent.parallelconsumer.PollContext;
import org.apache.kafka.clients.consumer.Consumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.config.KafkaListenerEndpointRegistry;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.MessageListener;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.IntStream;

@SpringBootApplication
public class SpringKafkaDemoApplication {

    private static final Logger logger = LoggerFactory.getLogger(SpringKafkaDemoApplication.class);

    public static void main(String[] args) {
        ApplicationContext ctx = SpringApplication.run(SpringKafkaDemoApplication.class, args);

//        ParallelStreamProcessor<String, String> parallelConsumer = ctx.getBean(ParallelStreamProcessor.class);
//        parallelConsumer.poll(record -> logger.info("Concurrently processing a record: key - {}; value - {}", record.key(), record.value()));
    }

//    @KafkaListener(id = "kgh2381", topics = "kgh2381", autoStartup = "false")
//    void listen(String in) {
//        logger.info("maoamamooamamoaomomamoa => " + in);
//    }

//    @Bean
//    ApplicationRunner runner(KafkaListenerEndpointRegistry registry, ConsumerFactory<String, String> cf,
//                             KafkaTemplate<String, String> template) {
//
//        return args -> {
//            MessageListener messageListener = (MessageListener) registry.getListenerContainer("kgh2381")
//                    .getContainerProperties().getMessageListener();
//            Consumer<String, String> consumer = cf.createConsumer("group", "");
//            var options = ParallelConsumerOptions.<String, String>builder()
//                    .ordering(ParallelConsumerOptions.ProcessingOrder.KEY)
//                    .consumer(consumer)
//                    .maxConcurrency(10)
//                    .build();
//
//            ParallelStreamProcessor<String, String> processor = ParallelStreamProcessor.createEosStreamProcessor(options);
//            processor.subscribe(List.of("kgh2381"));
//            processor.poll(context -> messageListener.onMessage(context.getSingleConsumerRecord(), null, consumer));
//            IntStream.range(0, 10).forEach(i -> template.send("kgh2381", "foo" + i));
//        };
//    }

//    @Bean
//    public ApplicationRunner runner(KafkaListenerEndpointRegistry registry, ConsumerFactory<String, String> cf, KafkaTemplate<String, String> template){
//        return args -> {
//            registry.getListenerContainers().forEach(msgListenerContainer -> {
//                msgListenerContainer.start();
//            });
//        };
//    }
}
