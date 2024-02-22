package com.programming.technie.services;

import com.programming.technie.models.User;

import org.springframework.security.core.userdetails.UserDetailsService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface UserService {

    Mono<User> createUser(User user);

    Mono<User> getUserById(Long userId);

    Flux<User> findAll();

    Mono<User> updateUser(User user);

    Mono<String> deleteUser(Long userId);

    Flux<User> findByFirstNameContaining(String firstName);
}
