package com.programming.technie.nats_base.annotations;

public record NatsListenerMetadata(
        Object bean, String subject, String durableName, String consumerGroup,
        boolean autoAck, int maxDeliver, int maxAckPending
) {
}
