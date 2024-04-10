package com.programming.technie.controller;

import com.programming.technie.entity.User;
import com.programming.technie.repository.UserRepository;
import com.programming.technie.service.UserServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.reactive.server.WebTestClient;

import reactor.core.publisher.Mono;

import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@WebFluxTest(controllers = UserController.class)
@Import(UserServiceImpl.class)
class UserControllerTest {
    @Mock
    UserRepository userRepository;

    @Autowired
    private WebTestClient webClient;

    @Test
    void testCreateUser() {
        User user = new User();
        user.setId(1L);
        user.setFirstName("Test");
        user.setLastName("Testababab");

        when(userRepository.save(user)).thenReturn(Mono.just(user));

        webClient.post()
                .uri("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Mono.just(user), User.class)
                .exchange()
                .expectStatus().isCreated();

        verify(userRepository, times(1)).save(user);
    }

//    @Test
//    void testGetUsersByName() {
//        User user = new User();
//        user.setId(1L);
//        user.setFirstName("Test");
//        user.setLastName("tetetete");
//
//        List<User> list = List.of(user);
//
//        Flux<User> userFlux = Flux.fromIterable(list);
//
//        when(userRepository.findByFirstNameContaining("Test")).thenReturn(userFlux);
//
//        webClient.get().uri("api/users", "Test")
//                .header(HttpHeaders.ACCEPT, "application/json")
//                .exchange()
//                .expectStatus().isOk()
//                .expectBodyList(User.class);
//
//        Mockito.verify(userRepository, times(1)).findByName("Test");
//    }
//
//    @Test
//    void testGetUserById() {
//        User user = new User();
//        user.setId(100);
//        user.setName("Test");
//        user.setSalary(1000);
//
//        Mockito
//                .when(userRepository.findById(100))
//                .thenReturn(Mono.just(user));
//
//        webClient.get().uri("/{id}", 100)
//                .exchange()
//                .expectStatus().isOk()
//                .expectBody()
//                .jsonPath("$.name").isNotEmpty()
//                .jsonPath("$.id").isEqualTo(100)
//                .jsonPath("$.name").isEqualTo("Test")
//                .jsonPath("$.salary").isEqualTo(1000);
//
//        Mockito.verify(userRepository, times(1)).findById(100);
//    }
//
//    @Test
//    void testDeleteUser() {
//        Mono<Void> voidReturn = Mono.empty();
//        Mockito
//                .when(userRepository.deleteById(1))
//                .thenReturn(voidReturn);
//
//        webClient.get().uri("/delete/{id}", 1)
//                .exchange()
//                .expectStatus().isOk();
//    }
}