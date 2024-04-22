package com.programming.technie.springkafkademo.helper;

import io.confluent.parallelconsumer.ParallelConsumerOptions;
import io.confluent.parallelconsumer.ParallelStreamProcessor;
import org.apache.kafka.clients.consumer.Consumer;

public class KafkaParallelHelper {

    public static ParallelStreamProcessor<String, String> genParallelConsumerOptions(Consumer<String, String> consumer) {
        ParallelConsumerOptions<String, String> options = ParallelConsumerOptions.<String, String>builder()
                .ordering(ParallelConsumerOptions.ProcessingOrder.UNORDERED)
                .maxConcurrency(10)
                .consumer(consumer)
                .build();
        return ParallelStreamProcessor.createEosStreamProcessor(options);
    }
}
