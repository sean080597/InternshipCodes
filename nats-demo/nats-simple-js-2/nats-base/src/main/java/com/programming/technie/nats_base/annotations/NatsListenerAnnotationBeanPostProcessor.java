package com.programming.technie.nats_base.annotations;

import io.nats.client.*;
import io.nats.client.api.ConsumerConfiguration;
import io.nats.client.support.JsonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.SmartInitializingSingleton;
import org.springframework.beans.factory.config.*;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.expression.StandardBeanExpressionResolver;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class NatsListenerAnnotationBeanPostProcessor implements BeanPostProcessor, Ordered, ApplicationContextAware, SmartInitializingSingleton {

    private static final Logger logger = LoggerFactory.getLogger(NatsListenerAnnotationBeanPostProcessor.class);

    private final Connection natsConnection;
    private final JetStream jetStream;
    private final BeanExpressionResolver resolver = new StandardBeanExpressionResolver();
    private BeanExpressionContext expressionContext;

    private final List<NatsListenerMetadata> natsListeners = new ArrayList<>();

    @Lazy // beans are injected eagerly in BeanPostProcessor --> defer until they are first used
    public NatsListenerAnnotationBeanPostProcessor(Connection natsConnection, JetStream jetStream) throws JetStreamApiException, IOException {
        this.natsConnection = natsConnection;
        this.jetStream = jetStream;
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.expressionContext = new BeanExpressionContext((ConfigurableBeanFactory) applicationContext.getAutowireCapableBeanFactory(), null);
    }

    @Override
    public int getOrder() {
        return LOWEST_PRECEDENCE;
    }

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        if (beanName.equals("subscriber")) {
            logger.debug("bean name subscriber");
        }

        // Check if the bean has the @NatsListener annotation
        if (bean.getClass().isAnnotationPresent(NatsListener.class)) {
            NatsListener annotation = bean.getClass().getAnnotation(NatsListener.class);
            String subject = resolveExpression(annotation.subject());
            String durableName = resolveExpression(annotation.durableName());
            String consumerGroup = resolveExpression(annotation.consumerGroup());
            boolean autoAck = annotation.autoAck();
            int maxDeliver = annotation.maxDeliver();
            int maxAckPending = annotation.maxAckPending();

            // Collect listener metadata for post-initialization setup
            natsListeners.add(new NatsListenerMetadata(bean, subject, durableName, consumerGroup, autoAck, maxDeliver, maxAckPending));
        }

        return bean;
    }

    private String resolveExpression(String expression) {
        return (String) this.resolver.evaluate(expression, this.expressionContext);
    }

    @Override
    public void afterSingletonsInstantiated() {
        // Initialize each NATS listener after all singletons are instantiated
        for (NatsListenerMetadata metadata : natsListeners) {
            initializeNatsListener(metadata);
        }
    }

    private void initializeNatsListener(NatsListenerMetadata metadata) {
        // Logic to create and configure the NATS consumer
        logger.info("Initializing NATS Listener: {}", metadata.toString());

        ConsumerConfiguration consumerConfig = ConsumerConfiguration.builder()
                .durable(metadata.durableName) // consumer name
                .maxDeliver(metadata.maxDeliver) // Deliver only once, no retries
                .maxAckPending(metadata.maxAckPending)
                .build();

        PushSubscribeOptions options = PushSubscribeOptions.builder().configuration(consumerConfig).build();

        try {
            JetStreamSubscription sub = jetStream.subscribe(
                    metadata.subject, metadata.consumerGroup,
                    natsConnection.createDispatcher(), message -> processMessage(message, metadata.bean),
                    metadata.autoAck, options
            );
            JsonUtils.printFormatted(sub);
        } catch (IOException | JetStreamApiException e) {
            throw new RuntimeException(e);
        }

        // Optionally store or log the subscription for later use
    }

    private void processMessage(Message msg, Object bean) throws InterruptedException {
        // Handle the message, possibly by invoking a method on the bean instance
        if (!(bean instanceof MessageHandler)) {
            return;
        }

        ((MessageHandler) bean).onMessage(msg);
    }

    private record NatsListenerMetadata(
            Object bean, String subject, String durableName, String consumerGroup,
            boolean autoAck, int maxDeliver, int maxAckPending
    ) {
    }

}
