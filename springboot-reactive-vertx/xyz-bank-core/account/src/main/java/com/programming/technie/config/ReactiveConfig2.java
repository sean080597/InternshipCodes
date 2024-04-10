package com.programming.technie.config;

import io.smallrye.mutiny.Uni;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.persistence.spi.PersistenceProvider;
import jakarta.persistence.spi.PersistenceUnitInfo;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.reactive.mutiny.Mutiny;
import org.hibernate.reactive.provider.ReactivePersistenceProvider;
import org.hibernate.reactive.provider.Settings;
import org.reflections.Reflections;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.util.*;

@Configuration
public class ReactiveConfig2 {

    @Bean
    public Mutiny.SessionFactory sessionFactory() {
        Map<String, String> properties = new HashMap<>();

        String ip = System.getProperty("db.ip");
        String port = System.getProperty("db.port");
        String name = System.getProperty("db.name");
        String schema = System.getProperty("db.schema");
        String url = "jdbc:mysql://tidb.dev.cardx.aliyun.xyzcloud.tech:14100/cardcore_issuing";

        if (StringUtils.isNotBlank(ip) && StringUtils.isNotBlank(port) && StringUtils.isNotBlank(name) && StringUtils.isNotBlank(schema)) {
            url = "jdbc:mysql://" + ip + ":" + port + "/" + name + "?currentSchema=" + schema
                + "&allowMultiQueries=true"
                + "&useServerPrepStmts=true"
                + "&cachePrepStmts=true"
                + "&useConfigs=maxPerformance"
                + "&prepStmtCacheSize=1000"
                + "&prepStmtCacheSqlLimit=1000000"
                + "&useCursorFetch=true"
                + "&fetchSize=20"
                + "&rewriteBatchedStatements=true";
        }

        properties.put(Settings.JAKARTA_JDBC_URL, url);
        properties.put(Settings.JAKARTA_JDBC_USER, System.getProperty("db.username"));
        properties.put(Settings.JAKARTA_JDBC_PASSWORD, System.getProperty("db.password"));
        properties.put(Settings.POOL_SIZE, "10");
        properties.put(Settings.SHOW_SQL, "true");
        properties.put(Settings.FORMAT_SQL, "true");
        properties.put(Settings.HIGHLIGHT_SQL, "true");
//        properties.put("jakarta.persistence.schema-generation.database.action", "create-drop");

        // get list of entities
        List<String> entityClassNames = new ArrayList<>();
        Reflections reflections = new Reflections("com.programming.technie.entity");
        for (Class<?> clazz : reflections.getTypesAnnotatedWith(Entity.class)) {
            entityClassNames.add(clazz.getName());
        }

        // create EntityManagerFactory
        PersistenceProvider provider = new ReactivePersistenceProvider();
        PersistenceUnitInfo info = new CustomPersistenceUnitInfo("default", entityClassNames);
//        return Persistence.createEntityManagerFactory("default", properties).unwrap(Mutiny.SessionFactory.class);
        return provider.createContainerEntityManagerFactory(info, properties).unwrap(Mutiny.SessionFactory.class);
    }
}
