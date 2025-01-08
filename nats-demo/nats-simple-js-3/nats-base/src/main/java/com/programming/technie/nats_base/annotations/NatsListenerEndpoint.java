package com.programming.technie.nats_base.annotations;

import io.nats.client.*;
import io.nats.client.api.ConsumerConfiguration;

import java.io.IOException;
import java.lang.reflect.Method;

public class NatsListenerEndpoint {
    private final String id;
    private final String subject;
    private final String consumerGroup;
    private final int maxDeliver;
    private final int maxAckPending;
    private final Method method;
    private final Object bean;
    private final boolean autoAck;
    private JetStreamSubscription subscription;

    public NatsListenerEndpoint(String id, String subject, String consumerGroup, int maxDeliver, int maxAckPending, Method method, Object bean, boolean autoAck) {
        this.id = id;
        this.subject = subject;
        this.consumerGroup = consumerGroup;
        this.maxDeliver = maxDeliver;
        this.maxAckPending = maxAckPending;
        this.method = method;
        this.bean = bean;
        this.autoAck = autoAck;
    }

    public String getInfos() {
        return String.format(
                "NatsListenerEndpoint { id='%s', subject='%s', consumerGroup='%s', maxDeliver=%d, maxAckPending=%d, autoAck=%b, method='%s', bean='%s' }",
                id, subject, consumerGroup, maxDeliver, maxAckPending, autoAck,
                method != null ? method.getName() : "null",
                bean != null ? bean.getClass().getName() : "null"
        );
    }

    public void startSubscription(Connection natsConnection) throws IOException, JetStreamApiException {
        ConsumerConfiguration consumerConfig = ConsumerConfiguration.builder()
                .durable(id).maxDeliver(maxDeliver).maxAckPending(maxAckPending)
                .build();

        PushSubscribeOptions options = PushSubscribeOptions.builder().configuration(consumerConfig).build();

        subscription = natsConnection.jetStream().subscribe(
                subject, consumerGroup,
                natsConnection.createDispatcher(),
                (Message msg) -> {
                    try {
                        if (msg.isJetStream()) {
                            method.invoke(bean, msg);
                            msg.ack();
                        } else if (msg.isStatusMessage()) {
                            method.invoke(bean, msg);
                        }
                    } catch (Exception e) {
                        // Handle exception appropriately
                    }
                },
                autoAck, options
        );
    }

    public void destroy() {
        if (subscription != null) {
            subscription.unsubscribe();
        }
    }

    public String getId() {
        return id;
    }

}
