package com.programming.technie.services;

import com.programming.technie.models.UserInfo;
import com.programming.technie.models.UserInfoDetails;
import com.programming.technie.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder encoder;

    @Override
    public Mono<UserDetails> findByUsername(String username) {
        Mono<UserInfo> found = userRepository.findByUsername(username);
        return found.map(UserInfoDetails::new);
//        return found.flatMap(u -> Mono.justOrEmpty(new UserInfoDetails(u)));
    }

    @Override
    public Mono<UserInfo> createUser(UserInfo user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public Mono<UserInfo> getUserById(Long userId) {
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
    public Flux<UserInfo> findAll() {
//        blockingOperation();
        return userRepository.findAll();
    }

    @Override
    public Mono<UserInfo> updateUser(UserInfo user) {
        return userRepository.findById(user.getId())
                .map(Optional::of).defaultIfEmpty(Optional.empty())
                .flatMap(opt -> {
                    if (opt.isPresent()) {
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
    public Flux<UserInfo> findByFirstNameContaining(String firstName) {
        return userRepository.findByFirstNameContaining(firstName);
    }
}
