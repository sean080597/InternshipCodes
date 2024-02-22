package com.programming.technie.controllers;

import com.programming.technie.models.User;
import com.programming.technie.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@AllArgsConstructor
@RequestMapping("api/users")
@RestController
public class UserController {

    private UserService userService;

    // build create User REST API
    @PostMapping
    public Mono<User> createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    // build get user by id REST API
    // http://localhost:8080/api/users/1
    @GetMapping("{id}")
    public Mono<User> getUserById(@PathVariable("id") Long userId) {
        return userService.getUserById(userId);
    }

    // Build Get All Users REST API
    // http://localhost:8080/api/users
    @GetMapping
    public Flux<User> getAllUsers(@RequestParam(required = false) String name) {
        return name == null ? userService.findAll() : userService.findByFirstNameContaining(name);
    }

    // Build Update User REST API
    @PutMapping("{id}")
    // http://localhost:8080/api/users/1
    public Mono<User> updateUser(@PathVariable("id") Long userId, @RequestBody User user) {
        user.setId(userId);
        return userService.updateUser(user);
    }

    // Build Delete User REST API
    @DeleteMapping("{id}")
    public Mono<String> deleteUser(@PathVariable("id") Long userId) {
        return userService.deleteUser(userId);
    }
}
