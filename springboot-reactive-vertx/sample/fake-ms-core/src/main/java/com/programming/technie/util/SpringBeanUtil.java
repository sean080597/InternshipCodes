package com.programming.technie.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.MessageSource;

public class SpringBeanUtil {

    private static Logger log = LoggerFactory.getLogger(SpringBeanUtil.class);
    private final ApplicationContext ctx;

    public SpringBeanUtil(ApplicationContext ctx) {
        this.ctx = ctx;
    }

    public <T> T getBean(Class<T> var0) {
        return getApplicationContext().getBean(var0);
    }

    public Object lookup(String var0) {
        return getApplicationContext().getBean(var0);
    }

    public <T> T lookup(String var0, Class<T> var1) {
        return getApplicationContext().getBean(var0, var1);
    }

    public ApplicationContext getApplicationContext() {
        return ctx;
    }

    public MessageSource getMessageSource() {
        return (MessageSource) ctx.getBean("messageSource");
    }
}
