package com.programming.technie.orderservice.service;

import com.programming.technie.orderservice.dto.OrderLineItemDto;
import com.programming.technie.orderservice.dto.OrderRequest;
import com.programming.technie.orderservice.model.Order;
import com.programming.technie.orderservice.model.OrderLineItem;
import com.programming.technie.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;

    public void placeOrder(OrderRequest req) {
        Order order = new Order();
        order.setOrderNumber(UUID.randomUUID().toString());

        List<OrderLineItem> orderLineItems = req.getOrderLineItemDtoList()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        order.setOrderLineItemList(orderLineItems);

        // call Inventory Service and place order if product is in stock
        orderRepository.save(order);
    }

    private OrderLineItem mapToDto(OrderLineItemDto orderLineItemsDto) {
        OrderLineItem orderLineItem = new OrderLineItem();
        orderLineItem.setPrice(orderLineItemsDto.getPrice());
        orderLineItem.setQuantity(orderLineItemsDto.getQuantity());
        orderLineItem.setSkuCode(orderLineItemsDto.getSkuCode());
        return orderLineItem;
    }
}
