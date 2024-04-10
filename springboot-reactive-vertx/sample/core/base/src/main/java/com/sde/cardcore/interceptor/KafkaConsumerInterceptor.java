package com.xyz.cardcore.interceptor;

import java.util.Map;

import org.apache.kafka.clients.consumer.ConsumerInterceptor;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.OffsetAndMetadata;
import org.apache.kafka.common.TopicPartition;
import org.apache.kafka.common.header.Header;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.xyz.ms.dto.OBBase;
import com.xyz.ms.util.FishTagUtil;

@Service
public class KafkaConsumerInterceptor implements ConsumerInterceptor<String, OBBase> {

    private static final Logger log = LoggerFactory.getLogger(KafkaConsumerInterceptor.class);

    @Override
    public void configure(Map<String, ?> configs) {

    }

    @Override
    public ConsumerRecords<String, OBBase> onConsume(ConsumerRecords<String, OBBase> records) {
        for (ConsumerRecord<String, OBBase> each : records) {
            Header fishTagId = each.headers().lastHeader("X-TAG-ID");
            if (fishTagId != null) {
                String tagId = new String(fishTagId.value());
                FishTagUtil.setIdToMDC(tagId);
            }
        }
        return records;
    }

    @Override
    public void onCommit(Map<TopicPartition, OffsetAndMetadata> offsets) {
        FishTagUtil.clear();
    }

    @Override
    public void close() {

    }

}
