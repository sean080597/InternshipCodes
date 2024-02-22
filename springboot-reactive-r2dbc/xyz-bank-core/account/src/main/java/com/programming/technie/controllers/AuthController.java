package com.programming.technie.controllers;

import com.programming.technie.dto.LoginReq;
import com.programming.technie.models.ReqResModel;
import com.programming.technie.services.JWTService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Objects;

@RequestMapping("api")
@RestController
public class AuthController {

    final ReactiveUserDetailsService users;
    final PasswordEncoder encoder;
    final JWTService jwtService;

    public AuthController(ReactiveUserDetailsService users, JWTService jwtService, PasswordEncoder encoder) {
        this.users = users;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    @GetMapping("auth")
    public Mono<ResponseEntity<ReqResModel<String>>> auth() {
        return Mono.just(ResponseEntity.ok(new ReqResModel<>("Hello welcome to the club how did you get authenticated?", "")));
    }

    @PostMapping("login")
    public Mono<ResponseEntity<ReqResModel<String>>> login(@RequestBody LoginReq user) {
        Mono<UserDetails> found = users.findByUsername(user.getEmail()).switchIfEmpty(Mono.empty());

        return found.flatMap(u -> {
            if (u == null) {
                return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ReqResModel<>("", "User not found. Please register")));
            }

            if (!encoder.matches(user.getPassword(), u.getPassword())) {
                return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ReqResModel<>("", "Invalid credentials")));
            }

            return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ReqResModel<>(jwtService.generate(u.getUsername()), "Success")));
        });
    }
}
