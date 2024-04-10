package com.programming.technie.repository;

import com.programming.technie.exception.UserNotFoundException;
import com.programming.technie.helper.ReactiveHelper;
import com.programming.technie.entity.User;

import io.smallrye.mutiny.Uni;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaDelete;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.metamodel.EntityType;
import lombok.RequiredArgsConstructor;
import org.hibernate.reactive.mutiny.Mutiny;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Objects;
import java.util.logging.Logger;

@Component
@RequiredArgsConstructor
public class UserRepository {
    private static final Logger LOGGER = Logger.getLogger(UserRepository.class.getName());
    private final Mutiny.SessionFactory sessionFactory;

    public Mono<List<User>> findAll_usingAPI() {
        Uni<List<User>> rs = this.sessionFactory.withSession(ss -> ss.createQuery("from User", User.class).getResultList());
        return ReactiveHelper.convertUniToMono(rs);
    }

    public Flux<User> findAll_usingQuery() {
        CriteriaBuilder cb = this.sessionFactory.getCriteriaBuilder();
        // create query
        CriteriaQuery<User> query = cb.createQuery(User.class);
        // set the root class
        Root<User> root = query.from(User.class);
        Uni<List<User>> rs = this.sessionFactory.withSession(ss -> ss.createQuery(query).getResultList());
        return ReactiveHelper.convertUniToFlux(rs);
    }

    public Mono<List<User>> findByFirstName(String q, int offset, int limit) {
        CriteriaBuilder cb = this.sessionFactory.getCriteriaBuilder();
        // create query
        CriteriaQuery<User> query = cb.createQuery(User.class);
        // set the root class
        Root<User> root = query.from(User.class);
        // if keyword is provided
        if (q != null && !q.trim().isEmpty()) {
            query.where(
                    cb.or(
                            cb.like(root.get("firstName"), "%" + q + "%"),
                            cb.like(root.get("lastName"), "%" + q + "%"),
                            cb.like(root.get("email"), "%" + q + "%")
                    )
            );
        }
        //perform query
        Uni<List<User>> rs = this.sessionFactory.withSession(ss -> ss.createQuery(query)
                .setFirstResult(offset)
                .setMaxResults(limit)
                .getResultList());
        return ReactiveHelper.convertUniToMono(rs);
    }

    public Mono<User> findById(Long id) {
        Objects.requireNonNull(id, "id can not be null");
        Uni<User> rs = this.sessionFactory.withSession(ss -> ss.find(User.class, id))
                .onItem().ifNull().failWith(() -> new UserNotFoundException(id));
        return ReactiveHelper.convertUniToMono(rs);
    }

    public Mono<User> save(User user) {
        Uni<User> rs;
        if (user.getId() == null) {
            rs = this.sessionFactory.withSession(ss -> ss.persist(user).call(ss::flush).replaceWith(user));
        } else {
            rs = this.sessionFactory.withSession(ss -> ss.merge(user).onItem().call(ss::flush));
        }
        return ReactiveHelper.convertUniToMono(rs);
    }

    public Mono<String> deleteById_usingAPI(Long id) {
        Uni<String> rs = this.sessionFactory.withTransaction((ss, tx) -> ss.find(User.class, id).call(ss::remove))
                .chain(() -> Uni.createFrom().item("User deleted successfully"));
        return ReactiveHelper.convertUniToMono(rs);
    }

    public Mono<String> deleteById_usingQuery(Long id) {
        CriteriaBuilder cb = this.sessionFactory.getCriteriaBuilder();
        // create delete
        CriteriaDelete<User> delete = cb.createCriteriaDelete(User.class);
        // set the root class
        Root<User> root = delete.from(User.class);
        // set where clause
        delete.where(cb.equal(root.get("id"), id));

        // perform update
        Uni<String> rs = this.sessionFactory.withTransaction((ss) -> ss.createQuery(delete).executeUpdate()
                .chain(deletedCount -> Uni.createFrom().item("Deleted " + deletedCount + " records")));
        return ReactiveHelper.convertUniToMono(rs);
    }

    public List<String> test(){
        return sessionFactory.getMetamodel()
            .getEntities()
            .stream()
            .map(EntityType::getName)
//            .map(entityType -> entityType.getJavaType().getPackage().getName())
            .distinct()
            .toList();
    }
}
