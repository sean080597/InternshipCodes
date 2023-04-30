package com.programming.technie.orderservice.service;

import com.programming.technie.orderservice.dto.InventoryResponse;
import com.programming.technie.orderservice.dto.OrderLineItemDto;
import com.programming.technie.orderservice.dto.OrderRequest;
import com.programming.technie.orderservice.model.Order;
import com.programming.technie.orderservice.model.OrderLineItem;
import com.programming.technie.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.sleuth.Span;
import org.springframework.cloud.sleuth.Tracer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class OrderService {

  private final OrderRepository orderRepository;
  private final WebClient.Builder webClientBuilder;
  private final Tracer tracer;

  public String placeOrder(OrderRequest req) {
    Order order = new Order();
    order.setOrderNumber(UUID.randomUUID().toString());

    List<OrderLineItem> orderLineItems = req.getOrderLineItemDtoList()
        .stream()
        .map(this::mapToDto)
        .collect(Collectors.toList());
    order.setOrderLineItemList(orderLineItems);

    List<String> skuCodes = order.getOrderLineItemList().stream().map(OrderLineItem::getSkuCode).collect(Collectors.toList());

    log.info("Calling inventory service");
    Span inventoryServiceLookup = tracer.nextSpan().name("InventoryServiceLookup");
    try (Tracer.SpanInScope spanInScope = tracer.withSpan(inventoryServiceLookup.start())) {
      // call Inventory Service and place order if product is in stock
      InventoryResponse[] inventoryResponseArr = webClientBuilder.build().get()
          .uri("http://inventory-service/api/inventory", uriBuilder -> uriBuilder.queryParam("skuCode", skuCodes).build())
          .retrieve()
          .bodyToMono(InventoryResponse[].class)
          .block();

      boolean allProductsInStock = Arrays.stream(inventoryResponseArr).allMatch(InventoryResponse::isInStock);
      if (allProductsInStock) {
        orderRepository.save(order);
        return "Order placed successfully";
      } else {
        throw new IllegalArgumentException("Product is not in stock, please try again later");
      }
    } finally {
      inventoryServiceLookup.end();
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
