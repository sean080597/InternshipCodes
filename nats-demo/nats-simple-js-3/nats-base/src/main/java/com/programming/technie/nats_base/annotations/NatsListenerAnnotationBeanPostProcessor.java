package com.programming.technie.nats_base.annotations;

import io.nats.client.JetStreamApiException;
import io.nats.client.Message;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.aop.framework.Advised;
import org.springframework.aop.support.AopUtils;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.SmartInitializingSingleton;
import org.springframework.beans.factory.config.*;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.expression.StandardBeanExpressionResolver;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.core.annotation.MergedAnnotation;
import org.springframework.core.annotation.MergedAnnotations;
import org.springframework.stereotype.Component;
import org.springframework.util.ReflectionUtils;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.lang.reflect.AnnotatedElement;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class NatsListenerAnnotationBeanPostProcessor implements BeanPostProcessor, Ordered, ApplicationContextAware, SmartInitializingSingleton {

    private static final Logger logger = LoggerFactory.getLogger(NatsListenerAnnotationBeanPostProcessor.class);

    private final NatsListenerEndpointRegistry endpointRegistry;
    private BeanFactory beanFactory;
    private BeanExpressionResolver resolver = new StandardBeanExpressionResolver();
    private BeanExpressionContext expressionContext;

    @Lazy // beans are injected eagerly in BeanPostProcessor --> defer until they are first used
    public NatsListenerAnnotationBeanPostProcessor(NatsListenerEndpointRegistry endpointRegistry) {
        this.endpointRegistry = endpointRegistry;
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        if (applicationContext instanceof ConfigurableApplicationContext cac) {
            this.setBeanFactory(cac.getBeanFactory());
        } else {
            this.setBeanFactory(applicationContext);
        }
    }

    public synchronized void setBeanFactory(BeanFactory beanFactory) {
        this.beanFactory = beanFactory;
        if (beanFactory instanceof ConfigurableListableBeanFactory clbf) {
            this.resolver = clbf.getBeanExpressionResolver();
            this.expressionContext = new BeanExpressionContext(clbf, null);
        }
    }

    @Override
    public int getOrder() {
        return Integer.MAX_VALUE;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        // Look for the NatsListener annotation, including inherited annotations
        Class<?> targetClass = AopUtils.getTargetClass(bean);

        try {
            // Check class-level annotation
            NatsListener classListener = targetClass.getAnnotation(NatsListener.class);
            if (classListener != null) {
                this.processClassLevelListener(bean, targetClass, classListener);
            }

            // Check method-level annotations
            for (Method method : targetClass.getDeclaredMethods()) {
                NatsListener methodListener = method.getAnnotation(NatsListener.class);
                if (methodListener != null) {
                    this.processMethodLevelListener(bean, targetClass, method, methodListener);
                }
            }
        } catch (JetStreamApiException | IOException e) {
            throw new RuntimeException(e);
        }

        return bean;
    }

    @Override
    public void afterSingletonsInstantiated() {
        this.endpointRegistry.startAllSubscriptions();
    }

    // processing listener
    private void processClassLevelListener(Object bean, Class<?> beanClass, NatsListener listener) throws JetStreamApiException, IOException {
        List<Method> methods = new ArrayList<>();
        ReflectionUtils.doWithMethods(beanClass, (method) -> {
            NatsHandler rabbitHandler = AnnotationUtils.findAnnotation(method, NatsHandler.class);
            if (rabbitHandler != null) {
                Method methodToUse = this.checkProxy(method, bean);
                methods.add(methodToUse);
            }
        });

        // Find appropriate message handling method
        if (!methods.isEmpty()) {
            this.processListener(bean, beanClass, methods.getFirst(), listener);
        } else {
            logger.info("No @NatsHandler annotations found in bean type: {}", bean.getClass());
        }
    }

    private void processMethodLevelListener(Object bean, Class<?> beanClass, Method method, NatsListener listener) throws JetStreamApiException, IOException {
        this.processListener(bean, beanClass, method, listener);
    }

    private void processListener(Object bean, Class<?> beanClass, Method method, NatsListener listener) throws JetStreamApiException, IOException {
        String subject = this.resolveExpressionAsString(listener.subject(), "Subject");
        String durableName = this.resolveExpressionAsString(listener.durableName().isEmpty() ? beanClass.getName() : listener.durableName(), "Durable Name");
        String consumerGroup = this.resolveExpressionAsString(listener.consumerGroup(), "Consumer Group");
        boolean autoAck = listener.autoAck();
        int maxDeliver = listener.maxDeliver();
        int maxAckPending = listener.maxAckPending();

        NatsListenerEndpoint endpoint =
                new NatsListenerEndpoint(durableName, subject, consumerGroup, maxDeliver, maxAckPending, method, bean, autoAck);
        endpointRegistry.registerListenerEndpoint(endpoint);
    }

    private Method findMessageHandlerMethod(Class<?> beanClass) {
        // Find method that accepts Message parameter
        for (Method method : beanClass.getMethods()) {
            if (method.getParameterCount() == 1 && Message.class.isAssignableFrom(method.getParameterTypes()[0])) {
                return method;
            }
        }
        return null;
    }

    private List<NatsListener> findListenerAnnotations(AnnotatedElement element) {
        return MergedAnnotations.from(element, MergedAnnotations.SearchStrategy.TYPE_HIERARCHY).stream(NatsListener.class).filter((tma) -> {
            Object source = tma.getSource();
            String name = "";
            if (source instanceof Class<?> clazz) {
                name = clazz.getName();
            } else if (source instanceof Method method) {
                name = method.getDeclaringClass().getName();
            }

            return !name.contains("$MockitoMock$");
        }).map(MergedAnnotation::synthesize).collect(Collectors.toList());
    }

    private Method checkProxy(Method methodArg, Object bean) {
        Method method = methodArg;

        // Check if the bean is a JDK dynamic proxy
        if (AopUtils.isJdkDynamicProxy(bean)) {
            try {
                // Attempt to get the method from the proxy class itself
                method = bean.getClass().getMethod(method.getName(), method.getParameterTypes());

                // Get all interfaces that the JDK proxy class is implementing
                Class<?>[] proxiedInterfaces = ((Advised) bean).getProxiedInterfaces();

                // Use a while loop to iterate through each interface to find the method signature
                int i = 0;
                while (i < proxiedInterfaces.length) {
                    Class<?> iface = proxiedInterfaces[i];
                    try {
                        // Try to find the method in the current interface
                        method = iface.getMethod(method.getName(), method.getParameterTypes());
                        break; // Stop once we've found it
                    } catch (NoSuchMethodException ignored) {
                        // If the method is not in this interface, move to the next one
                    }
                    i++;
                }

            } catch (SecurityException e) {
                // Handle any security exceptions encountered during reflection
                ReflectionUtils.handleReflectionException(e);
            } catch (NoSuchMethodException ex) {
                // Handle cases where the method isn't found in any interfaces
                throw new IllegalStateException(
                        String.format("@RabbitListener method '%s' found on bean target class '%s', but not found in any interface(s) for a bean JDK proxy. Either pull the method up to an interface or switch to subclass (CGLIB) proxies by setting proxy-target-class/proxyTargetClass attribute to 'true'",
                                method.getName(), method.getDeclaringClass().getSimpleName()),
                        ex
                );
            }
        }

        // Return the located or unchanged method
        return method;
    }

    // SpEL (Spring Expression Language)
    private boolean resolveExpressionAsBoolean(String value) {
        return this.resolveExpressionAsBoolean(value, false);
    }

    private boolean resolveExpressionAsBoolean(String value, boolean defaultValue) {
        Object resolved = this.resolveExpression(value);
        if (resolved instanceof Boolean bool) {
            return bool;
        } else if (resolved instanceof String str) {
            return StringUtils.hasText(str) ? Boolean.parseBoolean(str) : defaultValue;
        } else {
            return defaultValue;
        }
    }

    protected String resolveExpressionAsString(String value, String attribute) {
        Object resolved = this.resolveExpression(value);
        if (resolved instanceof String str) {
            return str;
        } else {
            throw new IllegalStateException("The [" + attribute + "] must resolve to a String. Resolved to [" + resolved.getClass() + "] for [" + value + "]");
        }
    }

    private String resolveExpressionAsStringOrInteger(String value, String attribute) {
        if (!StringUtils.hasLength(value)) {
            return null;
        } else {
            Object resolved = this.resolveExpression(value);
            if (resolved instanceof String) {
                return (String) resolved;
            } else if (resolved instanceof Integer) {
                return resolved.toString();
            } else {
                throw new IllegalStateException("The [" + attribute + "] must resolve to a String. Resolved to [" + resolved.getClass() + "] for [" + value + "]");
            }
        }
    }

    private Object resolveExpression(String value) {
        String resolvedValue = this.resolve(value);
        return this.resolver.evaluate(resolvedValue, this.expressionContext);
    }

    private String resolve(String value) {
        if (this.beanFactory != null) {
            BeanFactory bf = this.beanFactory;
            if (bf instanceof ConfigurableBeanFactory cbf) {
                return cbf.resolveEmbeddedValue(value);
            }
        }

        return value;
    }
}
