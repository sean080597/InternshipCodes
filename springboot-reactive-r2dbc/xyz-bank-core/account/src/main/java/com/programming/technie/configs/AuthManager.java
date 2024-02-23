package com.programming.technie.configs;

import com.programming.technie.services.JWTService;
import com.programming.technie.services.UserService;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.Optional;

@Component
public class AuthManager implements ReactiveAuthenticationManager {

    final JWTService jwtService;
    final UserService userService;

    public AuthManager(JWTService jwtService, UserService userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @Override
    public Mono<Authentication> authenticate(Authentication authentication) {
        return Mono.justOrEmpty(authentication)
                .cast(BearerToken.class)
                .flatMap(auth -> {
                    String username = jwtService.getUsername(auth.getCredentials());
                    return userService.findByUsername(username)
                            .map(Optional::of).defaultIfEmpty(Optional.empty())
                            .flatMap(u -> {
                                if (u.isEmpty()) {
                                    return Mono.error(new IllegalArgumentException("User not found in Auth Manager"));
                                }
                                if (!jwtService.validate(u.get(), auth.getCredentials())) {
                                    return Mono.error(new IllegalArgumentException("Invalid/ Expired token"));
                                }
                                return Mono.just(new UsernamePasswordAuthenticationToken(u.get().getUsername(), u.get().getPassword(), u.get().getAuthorities()));
                            });
                });
    }
}
