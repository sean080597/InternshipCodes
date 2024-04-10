package com.programming.technie.service;

import com.programming.technie.entity.User;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

public interface UserService {
    Mono<User> createUser(User user);

    Mono<User> getUserById(Long userId);

    Mono<List<User>> findAll();

    Mono<User> updateUser(User user);

    Mono<String> deleteUser(Long userId);

    Mono<List<User>> findByFirstNameContaining(String firstName);

    List<String> test();
}
