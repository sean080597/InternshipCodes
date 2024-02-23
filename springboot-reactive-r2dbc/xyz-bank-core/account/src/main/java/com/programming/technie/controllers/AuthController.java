package com.programming.technie.controllers;

import com.programming.technie.dto.LoginReq;
import com.programming.technie.models.ReqResModel;
import com.programming.technie.services.JWTService;
import com.programming.technie.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Optional;

@RequestMapping("api")
@RestController
public class AuthController {

    final UserService userService;
    final PasswordEncoder encoder;
    final JWTService jwtService;

    public AuthController(UserService userService, JWTService jwtService, PasswordEncoder encoder) {
        this.userService = userService;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    @GetMapping("auth")
    public Mono<ResponseEntity<ReqResModel<String>>> auth() {
        return Mono.just(ResponseEntity.ok(new ReqResModel<>("Hello welcome to the club how did you get authenticated?", "")));
    }

    @PostMapping("login")
    public Mono<ResponseEntity<ReqResModel<String>>> login(@RequestBody LoginReq user) {
        return userService.findByUsername(user.getUsername())
                .map(Optional::of).defaultIfEmpty(Optional.empty())
                .flatMap(u -> {
                    if (u.isEmpty()) {
                        return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ReqResModel<>("", "User not found. Please register")));
                    }

                    if (!encoder.matches(user.getPassword(), u.get().getPassword())) {
                        return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ReqResModel<>("", "Invalid credentials")));
                    }

                    return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ReqResModel<>(jwtService.generate(u.get().getUsername()), "Success")));
                });
    }
}
