package com.programming.technie.nats_base.config;

import io.nats.client.Connection;
import io.nats.client.Nats;
import io.nats.client.Options;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

@Configuration
public class NATSConfig {

    private final Logger logger = LoggerFactory.getLogger(NATSConfig.class);

    @Value("${job.nats.uri}")
    private String natsUri;

    @Bean
    public Connection natsConnection() throws IOException, InterruptedException {
        Options options = Options.builder()
                .server(natsUri)
                .connectionListener((connection, event) -> logger.info("Connection Event: {}", event))
                .build();
        return Nats.connect(options);
    }
}
