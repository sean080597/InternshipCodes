package com.xyz.cardcore.setup.config;

import com.xyz.modelsuite.web.security.XyzContext;
import com.xyz.modelsuite.web.security.ThreadLocalXyzContextHolderStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.task.TaskDecorator;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.Map;
import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class AppConfig {
    private static Logger log = LoggerFactory.getLogger(AppConfig.class);

    @Autowired
    Environment env;

    public Executor getAsyncExecutor() {
        return executor();
    }

    @Bean //Let spring to handle
    public Executor executor() {

        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setTaskDecorator(new TaskDecorator() {

            @Override
            public Runnable decorate(Runnable runnable) {
                XyzContext xyzContext = ThreadLocalXyzContextHolderStrategy.getXyzContext();
                Map<String, String> mdcMap = MDC.getCopyOfContextMap();

                return () -> {
                    try {
                        ThreadLocalXyzContextHolderStrategy.setXyzContext(xyzContext);
                        MDC.setContextMap(mdcMap);
                        runnable.run();
                    } finally {
                        ThreadLocalXyzContextHolderStrategy.unset();
                        MDC.clear();
                    }
                };
            }
        });

        // play safe in case cannot detect any server
        //ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(100);
        executor.setMaxPoolSize(1000);
        executor.setQueueCapacity(100);
        executor.setAwaitTerminationSeconds(30);
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setThreadNamePrefix("ServiceExecutorApp-");
        return executor;
    }

    @Bean //Let spring to handle
    public Executor queueExecutor() {

        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();

        // play safe in case cannot detect any server
        //ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(40);// 1 Q 40(prefetch) msg, target 10 parallel
        executor.setMaxPoolSize(1000);
        executor.setQueueCapacity(40);
        executor.setAwaitTerminationSeconds(60);
        executor.setWaitForTasksToCompleteOnShutdown(true);

        executor.setAllowCoreThreadTimeOut(true);
        executor.setThreadNamePrefix("QueueExecutorApp-");
        return executor;
    }

    private String getActiveProfie() {
        String[] activeProfiles = env.getActiveProfiles();

        for (String profile : activeProfiles) {
            if ("DEV".equals(profile)
                || "SIT".equals(profile)
                || "UAT".equals(profile)
                || "DR".equals(profile)
                || "PROD".equals(profile)
            ) {
                return profile;
            }
        }

        return "DEV";
    }
}