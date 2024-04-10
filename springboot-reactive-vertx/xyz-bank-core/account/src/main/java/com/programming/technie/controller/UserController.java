package com.programming.technie.controller;

import com.programming.technie.entity.User;
import com.programming.technie.service.UserService;
import com.programming.technie.util.FishTagUtil;
import com.programming.technie.util.LogUtil;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import reactor.core.publisher.Mono;
import reactor.util.context.Context;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("api/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
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
    public Mono<List<User>> getAllUsers(@RequestParam(required = false) String name) {
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

    @GetMapping(path = "name/{name}")
    public Mono<String> getName(@PathVariable String name) {
        return Mono.just(String.format("finding restaurants for %s", name))
            .doOnEach(LogUtil.logOnNext(msg -> logger.info(msg)))
            .doOnEach(LogUtil.logOnNext(obj -> logger.info("found restaurant {}", obj)))
            .contextWrite(Context.of(FishTagUtil.getCtxId(), name));
    }

    @GetMapping("test")
    public List<String> listEntities() {
        return userService.test();
    }
}
