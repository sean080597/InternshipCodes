package com.programming.technie.springkafkademo.helper;

import io.confluent.parallelconsumer.ParallelConsumerOptions;
import io.confluent.parallelconsumer.ParallelStreamProcessor;
import org.apache.kafka.clients.consumer.Consumer;

public class KafkaParallelHelper {

    public static ParallelStreamProcessor<String, String> genParallelConsumerOptions(Consumer<String, String> consumer) {
        ParallelConsumerOptions<String, String> options = ParallelConsumerOptions.<String, String>builder()
            .ordering(ParallelConsumerOptions.ProcessingOrder.UNORDERED)
            .maxConcurrency(8)
            .consumer(consumer)
            .retryDelayProvider(recordContext -> {
                int numberOfFailedAttempts = recordContext.getNumberOfFailedAttempts();
                long delayMillis = (long) ((200 + Math.pow(2, numberOfFailedAttempts)) * 1000);
                return Duration.ofMillis(delayMillis);
            })
            .build();
        return ParallelStreamProcessor.createEosStreamProcessor(options);
    }
}
