package com.programming.technie.configs;

import com.programming.technie.services.JWTService;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class AuthManager implements ReactiveAuthenticationManager {

    final JWTService jwtService;
    final ReactiveUserDetailsService users;

    public AuthManager(JWTService jwtService, ReactiveUserDetailsService users) {
        this.jwtService = jwtService;
        this.users = users;
    }

    @Override
    public Mono<Authentication> authenticate(Authentication authentication) {
        return Mono.justOrEmpty(authentication)
                .cast(BearerToken.class)
                .flatMap(auth -> {
                    String username = jwtService.getUsername(auth.getCredentials());
                    Mono<UserDetails> found = users.findByUsername(username).switchIfEmpty(Mono.empty());
                    return found.flatMap(u -> {
                        if (u.getUsername() == null) {
                            Mono.error(new IllegalArgumentException("User not found in auth manager"));
                        }
                        if (!jwtService.validate(u, auth.getCredentials())) {
                            Mono.error(new IllegalArgumentException("Invalid/ Expired token"));
                        }
                        return Mono.justOrEmpty(new UsernamePasswordAuthenticationToken(u.getUsername(), u.getPassword(), u.getAuthorities()));
                    });
                });
    }
}
