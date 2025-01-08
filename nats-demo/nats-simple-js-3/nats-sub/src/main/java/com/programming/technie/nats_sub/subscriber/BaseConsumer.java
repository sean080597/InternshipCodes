package com.programming.technie.nats_sub.subscriber;

import io.nats.client.Message;
import io.nats.client.MessageHandler;
import io.nats.client.support.JsonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.ParameterizedType;
import java.nio.charset.StandardCharsets;

public abstract class BaseConsumer<T> {
    private static final Logger logger = LoggerFactory.getLogger(BaseConsumer.class);

    protected Class<T> typeOfT;

    public abstract void onMessage(T object) throws Exception;

    @SuppressWarnings("unchecked")
    public BaseConsumer() {
        this.typeOfT = (Class<T>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[0];
    }

    public void onCommonMessage(Message msg) throws InterruptedException {
        if (msg.isJetStream()) {
            msg.ack();
            System.out.print(" " + new String(msg.getData(), StandardCharsets.UTF_8) + "\n");
        } else if (msg.isStatusMessage()) {
            System.out.print(" !" + msg.getStatus().getCode() + "!");
        }
        JsonUtils.printFormatted(msg.metaData());
    }
}
