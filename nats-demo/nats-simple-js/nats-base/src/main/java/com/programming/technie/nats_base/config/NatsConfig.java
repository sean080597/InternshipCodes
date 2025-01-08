package com.programming.technie.nats_base.config;

import com.programming.technie.nats_base.enums.NatsEnum;
import io.nats.client.*;
import io.nats.client.api.RetentionPolicy;
import io.nats.client.api.StreamConfiguration;
import io.nats.client.api.StreamInfo;
import io.nats.client.support.JsonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.time.Duration;
import java.util.Optional;

@Configuration
public class NatsConfig {

    private final Logger logger = LoggerFactory.getLogger(NatsConfig.class);

    @Value("${nats.server}")
    private String natsServer;

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
                    .subjects(NatsEnum.STREAM_NAME.label + ".>")
                    .retentionPolicy(RetentionPolicy.WorkQueue) // Messages stay until acknowledged
                    .maxAge(Duration.ofDays(365)) // Retain messages up to 1 year (adjust as needed)
                    .build();
            StreamInfo streamInfo = jsm.addStream(streamConfig);
            JsonUtils.printFormatted(streamInfo);
        }
        return natsConnection.jetStream();
    }
}
