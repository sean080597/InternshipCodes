package com.programming.technie.nats_sub.subscriber;

import io.nats.client.Connection;
import io.nats.client.Dispatcher;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
public class Subscriber {

    private final String TOPIC = "order_updates";

    @Autowired
    private Connection connection;

    @PostConstruct
    public void subscriberTopic() {
        Dispatcher dispatcher = connection.createDispatcher((msg) -> {
            String response = new String(msg.getData(), StandardCharsets.UTF_8);
            Thread.sleep(3000);
            System.out.println("Received message on '" + msg.getSubject() + "': " + response);
        });

        dispatcher.subscribe(TOPIC, "order-service");
    }
}
