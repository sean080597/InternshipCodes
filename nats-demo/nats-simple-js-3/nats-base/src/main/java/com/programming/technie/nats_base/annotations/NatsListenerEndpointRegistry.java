package com.programming.technie.nats_base.annotations;

import io.nats.client.Connection;
import io.nats.client.JetStreamApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class NatsListenerEndpointRegistry implements DisposableBean {
    private static final Logger logger = LoggerFactory.getLogger(NatsListenerEndpointRegistry.class);
    private final Map<String, NatsListenerEndpoint> listenerEndpoints = new ConcurrentHashMap<>();
    private final Connection natsConnection;

    public NatsListenerEndpointRegistry(Connection natsConnection) {
        this.natsConnection = natsConnection;
    }

    public void registerListenerEndpoint(NatsListenerEndpoint endpoint) throws JetStreamApiException, IOException {
        String id = endpoint.getId();
        if (listenerEndpoints.containsKey(id)) {
            throw new IllegalStateException("Another endpoint is already registered with id '" + id + "'");
        }
        listenerEndpoints.put(id, endpoint);
    }

    public void startAllSubscriptions() {
        listenerEndpoints.values().forEach(endpoint -> {
            try {
                logger.info("Initializing NATS Listener: {}", endpoint.getInfos());
                endpoint.startSubscription(natsConnection);
            } catch (IOException | JetStreamApiException e) {
                throw new RuntimeException(e);
            }
        });
    }

    @Override
    public void destroy() throws Exception {
        listenerEndpoints.values().forEach(NatsListenerEndpoint::destroy);
        listenerEndpoints.clear();
    }
}
