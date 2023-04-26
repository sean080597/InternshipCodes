package com.programming.technie.orderservice.service;

import com.programming.technie.orderservice.dto.InventoryResponse;
import com.programming.technie.orderservice.dto.OrderLineItemDto;
import com.programming.technie.orderservice.dto.OrderRequest;
import com.programming.technie.orderservice.model.Order;
import com.programming.technie.orderservice.model.OrderLineItem;
import com.programming.technie.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final WebClient webClient;

    public void placeOrder(OrderRequest req) {
        Order order = new Order();
        order.setOrderNumber(UUID.randomUUID().toString());

        List<OrderLineItem> orderLineItems = req.getOrderLineItemDtoList()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        order.setOrderLineItemList(orderLineItems);

        List<String> skuCodes = order.getOrderLineItemList().stream().map(OrderLineItem::getSkuCode).collect(Collectors.toList());


        // call Inventory Service and place order if product is in stock
        InventoryResponse[] inventoryResponseArr = webClient.get()
                .uri("http://localhost:8082/api/inventory", uriBuilder -> uriBuilder.queryParam("skuCode", skuCodes).build())
                .retrieve()
                .bodyToMono(InventoryResponse[].class)
                .block();

        boolean allProductsInStock = Arrays.stream(inventoryResponseArr).allMatch(InventoryResponse::isInStock);
        if (allProductsInStock) {
            orderRepository.save(order);
        } else {
            throw new IllegalArgumentException("Product is not in stock, please try again later");
        }
    }

    private OrderLineItem mapToDto(OrderLineItemDto orderLineItemsDto) {
        OrderLineItem orderLineItem = new OrderLineItem();
        orderLineItem.setPrice(orderLineItemsDto.getPrice());
        orderLineItem.setQuantity(orderLineItemsDto.getQuantity());
        orderLineItem.setSkuCode(orderLineItemsDto.getSkuCode());
        return orderLineItem;
    }
}
