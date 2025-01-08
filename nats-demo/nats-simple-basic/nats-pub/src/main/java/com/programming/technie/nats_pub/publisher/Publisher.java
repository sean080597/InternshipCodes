package com.programming.technie.nats_pub.publisher;

import io.nats.client.Connection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
public class Publisher {

    @Autowired
    private Connection connection;

    public void sendMessage(String subject, String message) {
        connection.publish(subject, message.getBytes(StandardCharsets.UTF_8));
    }
}
