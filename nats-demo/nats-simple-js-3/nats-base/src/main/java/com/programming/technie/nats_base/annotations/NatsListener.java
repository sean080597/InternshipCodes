package com.programming.technie.nats_base.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface NatsListener {

    String subject(); // topic name

    String durableName() default ""; // consumer name

    String consumerGroup() default "";

    boolean autoAck() default false;

    int maxDeliver() default 1; // deliver only once, no retries

    int maxAckPending() default 1000; // messages can be in-flight at one time without an acknowledgement
}
