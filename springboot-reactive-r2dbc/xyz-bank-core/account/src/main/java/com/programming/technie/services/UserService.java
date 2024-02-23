package com.programming.technie.services;

import com.programming.technie.models.UserInfo;

import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface UserService extends ReactiveUserDetailsService {

    Mono<UserInfo> createUser(UserInfo user);

    Mono<UserInfo> getUserById(Long userId);

    Flux<UserInfo> findAll();

    Mono<UserInfo> updateUser(UserInfo user);

    Mono<String> deleteUser(Long userId);

    Flux<UserInfo> findByFirstNameContaining(String firstName);
}
