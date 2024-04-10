package com.xyz.cardcore.base;

import com.xyz.modelsuite.util.StringUtil;


public class BaseApplication2
{
    public static void set(String defaultHttpPort, String defaultHttpsPort)
    {
        // for log4j Thread usage
        // Data from current threads will be passed to child threads.
        System.setProperty("isThreadContextMapInheritable", "true");

        // default for everyone
        System.setProperty("org.jboss.logging.provider", "slf4j");

        try
        {
            // if LMAX found, enable it
            Class.forName("com.lmax.disruptor.dsl.Disruptor");

            // to make all loggers asynchronous
            System.setProperty("log4j2.contextSelector", "org.apache.logging.log4j.core.async.AsyncLoggerContextSelector");
            System.setProperty("log4j2.asyncLoggerRingBufferSize", (1024 * 1024) + ""); // default is 256 * 1024
        }
        catch (Exception e)
        {
            // do nothing
        }

        // to cater Tomcat logging
        System.setProperty("java.util.logging.manager", "org.apache.logging.log4j.jul.LogManager");

//        System.setProperty("spring.autoconfigure.exclude", "org.springframework.boot.autoconfigure.quartz.QuartzAutoConfiguration");

        String httpPort = System.getProperty("server.http.port");
        String httpsPort = System.getProperty("server.https.port");

        if (!StringUtil.hasValue(httpPort) || !StringUtil.hasValue(httpsPort))
        {
            System.out.println("Please configure VM Arguments if you wish to run on different ports, -Dserver.http.port=" + defaultHttpPort + " -Dserver.https.port=" + defaultHttpsPort + " -Xms512m -Xmx2048m");
        }
        else
        {
            // override default using pass in arguments
            defaultHttpPort = httpPort;
        }

        // default SpringBoot keyword
        System.setProperty("server.port", defaultHttpPort);

        // using SpringBoot way
        // System.setProperty("server.ssl.key-store-password", "12345678");
        // System.setProperty("server.ssl.key-store", "classpath:XYZ_2.keystore");
        // System.setProperty("server.ssl.key-store-type", "JKS");
        // System.setProperty("server.http2.enabled", "true");

        // to avoid 2 same instance start in the same server
        System.setProperty("javamelody.storage-directory", "javamelody." + defaultHttpPort);

        String profile = System.getProperty("spring.profiles.active");

        if (!StringUtil.hasValue(profile))
        {
            System.out.println("Please configure VM Arguments if you wish to run on different Profile, -Dspring.profiles.active=DEV, Current Default Profile = [DEV]");
            System.setProperty("spring.profiles.active", "DEV");
        }

        String dbIp = System.getProperty("db.ip");
        String dbPort = System.getProperty("db.port");
        String dbName = System.getProperty("db.name");
        String dbSchema = System.getProperty("db.schema");

        if (!StringUtil.hasValue(dbIp) || !StringUtil.hasValue(dbPort) || !StringUtil.hasValue(dbName) || !StringUtil.hasValue(dbSchema))
        {
            System.out.println("Please configure VM Arguments if you wish to connect to different Database, -Ddb.ip=127.0.0.1 -Ddb.port=5432 -Ddb.name=mob_v1 -Ddb.schema=mob_v1");
        }

        String redisIp = System.getProperty("redis.ip");
        String redisPort = System.getProperty("redis.port");
        String redisPassword = System.getProperty("redis.password");

        if (!StringUtil.hasValue(redisIp) || !StringUtil.hasValue(redisPort) || !StringUtil.hasValue(redisPassword))
        {
            System.out.println("Please configure VM Arguments if you wish to connect to different Redis Server, -Dredis.ip=127.0.0.1 -Dredis.port=6379 -Dredis.password=123456");
        }

        // kafka
        String kafkaUrl = System.getProperty("kafka.url");

        if (!StringUtil.hasValue(kafkaUrl))
        {
            System.out.println("Please configure VM Arguments if you wish to connect to different kafka Server, -Dkafka.url=127.0.0.1:35349");
        }

        // kafka.enabled
        String kafkaEnabled = System.getProperty("kafka.enabled");

        if (!StringUtil.hasValue(kafkaEnabled))
        {
            System.out.println("Please configure VM Arguments if you wish to enable Kafka, -Dkafka.enabled=true");
            System.setProperty("kafka.enabled", "false");
        }
        
        //queue
        String queueIp = System.getProperty("queue.ip");
        String queuePort = System.getProperty("queue.port");
        String queueUsername = System.getProperty("queue.username");
        String queuePassword = System.getProperty("queue.password");
        String queueVirtualHost = System.getProperty("queue.virtualHost");

        if (!StringUtil.hasValue(queueIp) || !StringUtil.hasValue(queuePort) || !StringUtil.hasValue(queueUsername) || !StringUtil.hasValue(queuePassword) || !StringUtil.hasValue(queueVirtualHost))
        {
            System.out.println("Please configure VM Arguments if you wish to connect to different Queue Server, -Dqueue.ip=127.0.0.1 -Dqueue.port=6379 -Dqueue.username=user -Dqueue.password=123456  -Dqueue.virtualHost=/mob_dev");
        }
        
        // queue.enabled
        String queueEnabled = System.getProperty("queue.enabled");

        if (!StringUtil.hasValue(queueEnabled))
        {
            System.out.println("Please configure VM Arguments if you wish to enable Queue, -Dqueue.enabled=true");
            System.setProperty("queue.enabled", "false");
        }

        System.setProperty("spring.webflux.base-path", "/");
    }
}
