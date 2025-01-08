package com.programming.technie.nats_base.enums;

public enum NatsEnum {
    STREAM_NAME("ORDERS");

    public final String label;

    NatsEnum(String label) {
        this.label = label;
    }
}
