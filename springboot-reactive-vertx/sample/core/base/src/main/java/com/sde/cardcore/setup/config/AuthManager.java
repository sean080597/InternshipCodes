package com.xyz.cardcore.setup.config;

import com.xyz.cardcore.service.SystemUserDetailsService;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import reactor.core.publisher.Mono;

public class AuthManager implements ReactiveAuthenticationManager {

    private final SystemUserDetailsService systemUserDetailsService;

    public AuthManager(SystemUserDetailsService systemUserDetailsService) {
        this.systemUserDetailsService = systemUserDetailsService;
    }

    @Override
    public Mono<Authentication> authenticate(Authentication authentication) {
        return Mono.justOrEmpty(authentication).flatMap(auth -> {
            String username = auth.getName();
            String password = auth.getCredentials().toString();

            return systemUserDetailsService.findByUsername(username).flatMap(userDetails -> {
                if (userDetails.getPassword().equals(password)) {
                    return Mono.just(new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities()));
                } else {
                    return Mono.error(new AuthenticationException("Invalid credentials") {
                    });
                }
            }).switchIfEmpty(Mono.error(new AuthenticationException("User not found") {}));
        });
    }
}
