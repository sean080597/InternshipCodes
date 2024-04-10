package com.programming.technie.config;

import jakarta.persistence.Persistence;
import org.hibernate.reactive.mutiny.Mutiny;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

//@Configuration
public class ReactiveConfig {

    @Bean
    public Mutiny.SessionFactory sessionFactory() {
        return Persistence.createEntityManagerFactory("myPU-3307").unwrap(Mutiny.SessionFactory.class);
    }
}
