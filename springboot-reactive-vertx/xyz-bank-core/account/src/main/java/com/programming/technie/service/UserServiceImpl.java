package com.programming.technie.service;

import com.programming.technie.entity.User;
import com.programming.technie.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
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

    @Override
    public Mono<List<User>> findAll() {
        return userRepository.findAll_usingAPI();
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
        return userRepository.deleteById_usingQuery(userId);
    }

    @Override
    public Mono<List<User>> findByFirstNameContaining(String firstName) {
        return userRepository.findByFirstName(firstName, 0, 10);
    }

    public List<String> test(){
        return userRepository.test();
    }
}
