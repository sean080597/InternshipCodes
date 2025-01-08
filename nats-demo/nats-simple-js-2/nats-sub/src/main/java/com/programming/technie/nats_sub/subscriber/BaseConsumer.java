package com.programming.technie.nats_sub.subscriber;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.ParameterizedType;

public abstract class BaseConsumer<T> {
    private static final Logger logger = LoggerFactory.getLogger(BaseConsumer.class);

    protected Class<T> typeOfT;

    public abstract void onMessage(T object) throws Exception;

    @SuppressWarnings("unchecked")
    public BaseConsumer() {
        this.typeOfT = (Class<T>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[0];
    }
}
