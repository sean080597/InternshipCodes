package com.programming.technie.nats_base.enums;

public enum NatsEnum {
    STREAM_NAME("CARDCORE_STREAM");

    public final String label;

    NatsEnum(String label) {
        this.label = label;
    }
}
