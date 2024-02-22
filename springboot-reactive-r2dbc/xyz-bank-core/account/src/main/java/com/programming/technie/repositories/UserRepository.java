package com.programming.technie.repositories;

import com.programming.technie.models.User;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface UserRepository extends ReactiveCrudRepository<User, Long> {
    Flux<User> findByFirstNameContaining(String firstName);
    Mono<User> findByEmail(String email);
}
