package com.programming.technie.config;

import jakarta.persistence.Entity;
import org.hibernate.reactive.mutiny.Mutiny;
import org.reflections.Reflections;

import java.util.Set;

public class EntityConfig {

    private final Mutiny.SessionFactory sessionFactory;

    public EntityConfig(Mutiny.SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    public void scanAndAddEntities() {
        Reflections reflections = new Reflections("com.programming.technie.entity");
        Set<Class<?>> entityClasses = reflections.getTypesAnnotatedWith(Entity.class);

        for (Class<?> clazz : entityClasses) {
            sessionFactory.withTransaction((ss, tx) -> ss.persist(clazz)).await().indefinitely();
        }
    }
}
