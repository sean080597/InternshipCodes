package com.programming.technie.orderservice.controller;

import com.programming.technie.orderservice.dto.OrderRequest;
import com.programming.technie.orderservice.service.OrderService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {

  private final OrderService orderService;

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @CircuitBreaker(name = "inventory", fallbackMethod = "fallbackMethod")
  @TimeLimiter(name = "inventory")
  @Retry(name = "inventory")
  public CompletableFuture<String> placeOrder(@RequestBody OrderRequest req) {
    return CompletableFuture.supplyAsync(() -> orderService.placeOrder(req));
  }

  private CompletableFuture<String> fallbackMethod(OrderRequest req, RuntimeException ex) {
    return CompletableFuture.supplyAsync(() -> "Oops! Something went wrong, please order after some time!");
  }
}
