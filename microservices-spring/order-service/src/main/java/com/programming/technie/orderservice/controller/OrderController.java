package com.programming.technie.orderservice.controller;

import com.programming.technie.orderservice.dto.OrderRequest;
import com.programming.technie.orderservice.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public String placeOrder(@RequestBody OrderRequest req){
        orderService.placeOrder(req);
        return "Order placed successfully";
    }
}
