package com.programming.technie.nats_base.config;

import com.programming.technie.nats_base.enums.NatsEnum;
import io.nats.client.*;
import io.nats.client.api.RetentionPolicy;
import io.nats.client.api.StreamConfiguration;
import io.nats.client.api.StreamInfo;
import io.nats.client.support.JsonUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import java.io.IOException;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@Configuration
public class NatsConfig {

    private final Logger logger = LoggerFactory.getLogger(NatsConfig.class);

    @Autowired
    Environment env;

    @Value("${nats.server}")
    private String natsServer;

    @Value("${nats.concurrent_max_consumer:1}")
    private String maxConcurrentConsumer;

    @Bean
    public Connection natsConnection() throws IOException, InterruptedException {
        Options options = Options.builder()
                .server(natsServer)
                .connectionListener((connection, event) -> logger.info("Connection Event: {}", event))
                .build();
        return Nats.connect(options);
    }

    @Bean
    public JetStream jetStream(Connection natsConnection) throws Exception {
        JetStreamManagement jsm = natsConnection.jetStreamManagement();

        try {
            StreamInfo streamInfo = jsm.getStreamInfo(NatsEnum.STREAM_NAME.label);
            JsonUtils.printFormatted(streamInfo);
        } catch (Exception e) {
            StreamConfiguration streamConfig = StreamConfiguration.builder()
                    .name(NatsEnum.STREAM_NAME.label)
                    .subjects(NatsEnum.STREAM_NAME.label + ".>") // capture messages by wildcard e.g. ORDERS.*
                    .retentionPolicy(RetentionPolicy.WorkQueue) // Messages stay until acknowledged
                    .maxAge(Duration.ofDays(365)) // Retain messages up to 1 year (adjust as needed)
                    .build();
            StreamInfo streamInfo = jsm.addStream(streamConfig);
            JsonUtils.printFormatted(streamInfo);
        }
        return natsConnection.jetStream();
    }

    @Bean
    public Map<String, Map<String, String>> queueNames() {
        String prefix = NatsEnum.STREAM_NAME.label + ".DEV-cuongqluu";
        Map<String, Map<String, String>> map = new LinkedHashMap<>();
        map.put("orderQueue", constructQueueValueMap("orderQueue", prefix + "-orderQueue-Queue"));

        map.put("notificationQueue", constructQueueValueMap("notificationQueue", prefix + "-notificationQueue-Queue"));
        return map;
    }

    private Map<String, String> constructQueueValueMap(String id, String queues) {
        Map<String, String> valuemap = new LinkedHashMap<>();
        valuemap.put("id", id); // durable/consumer name
        valuemap.put("queues", queues); // subject/topic name
        valuemap.put("group", id + "Group"); // group name

        // max consumers of group
        String max_str = getParameter("nats.concurrent_max_consumer." + id);
        valuemap.put("concurrency", StringUtils.isNotBlank(max_str) ? max_str : this.maxConcurrentConsumer);

        logger.debug("id [{}]  valuemap {}", id, valuemap);

        return valuemap;
    }

    private String getParameter(String key) {
        //System - get from java argument
        //env - get from property files
        String value = System.getProperty(key);

        if (StringUtils.isBlank(value)) {
            value = env.getProperty(key);
            logger.debug("param get from property file key [{}] value [{}]", key, value);
        } else {
            logger.debug("param get from java argument key [{}] value [{}]", key, value);
        }
        return value;
    }
}
