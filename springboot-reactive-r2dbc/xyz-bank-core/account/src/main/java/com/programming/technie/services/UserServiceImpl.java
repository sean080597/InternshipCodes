package com.programming.technie.services;

import com.programming.technie.models.User;
import com.programming.technie.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;

    @Override
    public Mono<User> createUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public Mono<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    private void blockingOperation() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Flux<User> findAll() {
//        blockingOperation();
        return userRepository.findAll();
    }

    @Override
    public Mono<User> updateUser(User user) {
        return userRepository.findById(user.getId())
                .map(Optional::of).defaultIfEmpty(Optional.empty())
                .flatMap(opt -> {
                    if (opt.isPresent()) {
                        user.setFirstName(user.getFirstName());
                        user.setLastName(user.getLastName());
                        user.setEmail(user.getEmail());
                        return userRepository.save(user);
                    }
                    return Mono.empty();
                });
    }

    @Override
    public Mono<String> deleteUser(Long userId) {
        return userRepository.deleteById(userId)
                .then(Mono.just("User with ID " + userId + " deleted successfully"))
                .onErrorResume(error -> Mono.just("Failed to delete user with ID " + userId + ": " + error.getMessage()));
    }

    @Override
    public Flux<User> findByFirstNameContaining(String firstName) {
        return userRepository.findByFirstNameContaining(firstName);
    }
}
