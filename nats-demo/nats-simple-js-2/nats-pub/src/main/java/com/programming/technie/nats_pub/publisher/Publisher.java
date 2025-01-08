package com.programming.technie.nats_pub.publisher;

import io.nats.client.JetStream;
import io.nats.client.api.PublishAck;
import io.nats.client.support.JsonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
public class Publisher {

    @Autowired
    private JetStream jetStream;

    public void sendMessage(String subject, String message) throws Exception {
        PublishAck ack = jetStream.publish(subject, message.getBytes(StandardCharsets.UTF_8));
        JsonUtils.printFormatted(ack);
    }
}
