package com.programming.technie.repositories;

import com.programming.technie.models.UserInfo;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface UserRepository extends ReactiveCrudRepository<UserInfo, Long> {
    Flux<UserInfo> findByFirstNameContaining(String firstName);

    Mono<UserInfo> findByUsername(String username);
}
