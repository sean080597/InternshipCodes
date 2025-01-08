package com.programming.technie.nats_sub.subscriber;

import com.programming.technie.nats_base.enums.NatsEnum;
import io.nats.client.*;
import io.nats.client.api.ConsumerConfiguration;
import io.nats.client.support.JsonUtils;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;

@Service
public class Subscriber {

    private static final String CONSUMER_NAME = "orderNewConsumer";
    private static final String CONSUMER_GROUP_NAME = "orderNewConsumerGroup";
    private static final String TOPIC_NAME = NatsEnum.STREAM_NAME.label + ".orderNew";

    @Autowired
    private Connection natsConnection;

    @Autowired
    private JetStream jetStream;

    @PostConstruct
    public void subscriberTopic() throws Exception {
        // Pull-based
//        ConsumerConfiguration consumerConfig = ConsumerConfiguration.builder().durable(GROUP_NAME).build();
//        PullSubscribeOptions pullOptions = PullSubscribeOptions.builder().configuration(consumerConfig).build();
//        JetStreamSubscription sub = jetStream.subscribe(TOPIC_NAME, pullOptions);
//        JsonUtils.printFormatted(sub);
//        this.pullMessages(sub);

        // Push-based
        boolean autoAck = false; // automatically acknowledged as soon as they’re delivered to the handler
        ConsumerConfiguration consumerConfig = ConsumerConfiguration.builder()
                .durable(CONSUMER_NAME)
                .maxDeliver(1) // Deliver only once, no retries
                .build();
        PushSubscribeOptions pushOptions = PushSubscribeOptions.builder().configuration(consumerConfig).build();
        JetStreamSubscription sub = jetStream.subscribe(TOPIC_NAME, CONSUMER_GROUP_NAME, natsConnection.createDispatcher(), this::processMessage, autoAck, pushOptions);
        JsonUtils.printFormatted(sub);
    }

    private void processMessage(Message msg) {
        if (msg.isJetStream()) {
            msg.ack();
            System.out.print(" " + new String(msg.getData(), StandardCharsets.UTF_8) + "\n");
        } else if (msg.isStatusMessage()) {
            System.out.print(" !" + msg.getStatus().getCode() + "!");
        }
        JsonUtils.printFormatted(msg.metaData());
    }

    private void pushMessage(JetStreamSubscription sub) throws InterruptedException {
        Message msg = sub.nextMessage(Duration.ofSeconds(1));
        boolean first = true;

        while (msg != null) {
            if (first) {
                first = false;
                System.out.print("Read/Ack on '" + msg.getSubject() + "' ->");
            }
            this.processMessage(msg);
            msg = sub.nextMessage(Duration.ofSeconds(1));
        }
    }

    private void pullMessages(JetStreamSubscription sub) {
        List<Message> messages = sub.fetch(5, Duration.ofSeconds(3));
        boolean first = true;

        /* ACK all received messages */
        for (Message msg : messages) {
            if (first) {
                first = false;
                System.out.print("Read/Ack on '" + msg.getSubject() + "' ->");
            }
            this.processMessage(msg);
        }
    }
}
