package com.xyz.cardcore;


import com.xyz.cardcore.issuing.card.data.service.CardMasterService;
import com.xyz.modelsuite.setup.context.WebApplicationContextFactory;
import io.vertx.core.Vertx;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration;
import org.springframework.boot.autoconfigure.aop.AopAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.quartz.QuartzAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

import com.xyz.cardcore.base.BaseApplication2;
import com.xyz.cardcore.setup.config.RabbitMQConfig;
import com.xyz.modelsuite.setup.initializer.EnvironmentContextInitializer;
import org.springframework.web.reactive.config.EnableWebFlux;
import reactor.blockhound.BlockHound;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@EnableWebFlux
@SpringBootApplication(exclude = {
    DataSourceAutoConfiguration.class,
    QuartzAutoConfiguration.class,
    RabbitAutoConfiguration.class,
})
@ComponentScan(basePackages = {"com.xyz.cardcore", "com.xyz.modelsuite.setup.context"},
    excludeFilters = {
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, value = RabbitMQConfig.class),
        @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = WebApplicationContextFactory.class),
    })
public class CardCoreApplication// extends SpringBootServletInitializer // extends BaseApplication
{
    private static final Logger log = LoggerFactory.getLogger(CardCoreApplication.class);

    public static void main(String[] args) throws Exception {
//        BlockHound.builder().allowBlockingCallsInside(Vertx.class.getName(), "executeBlocking").install();
//        BlockHound.install();

        String defaultHttpPort = "7702";
        String defaultHttpsPort = "7755";

        BaseApplication2.set(defaultHttpPort, defaultHttpsPort);

        new SpringApplicationBuilder(CardCoreApplication.class)
            .initializers(new EnvironmentContextInitializer())
            .run(args);
    }

//    @Bean
//    public CommandLineRunner commandLineRunner(ApplicationContext ctx) {
//        return args -> {
//            log.debug("Let's inspect the beans provided by Spring Boot:");
//            String[] beanNames = ctx.getBeanDefinitionNames();
//            List<String> beanLs = Arrays.stream(beanNames).sorted().toList();
//            log.debug(beanLs + "");
////            Map<String, Class<?>> map = Arrays.stream(beanNames)
////                .collect(Collectors.toMap(beanName -> beanName, beanName -> ctx.getType(beanName)));
////            map.forEach((name, type) -> log.debug(type + " - " + name));
//        };
//    }

//    @Override
//    protected SpringApplicationBuilder configure(SpringApplicationBuilder application)
//    {
//        return application.sources(CardCoreApplication.class);
//    }
}
