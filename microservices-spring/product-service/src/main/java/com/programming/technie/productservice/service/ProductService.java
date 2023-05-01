package com.programming.technie.productservice.service;

import com.programming.technie.productservice.dto.ProductRequest;
import com.programming.technie.productservice.dto.ProductResponse;
import com.programming.technie.productservice.repository.ProductRepository;
import com.programming.technie.productservice.model.Product;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class ProductService {

  private final ProductRepository productRepository;

  public void createProduct(ProductRequest req) {
    Product product = Product.builder()
        .name(req.getName())
        .description(req.getDescription())
        .price(req.getPrice())
        .build();

    productRepository.save(product);
    log.info("Product {} is saved", product.getId());
  }

  public List<ProductResponse> getAllProducts() {
    List<Product> products = productRepository.findAll();
    return products.stream().map(this::mapToProductResponse).collect(Collectors.toList());
  }

  private ProductResponse mapToProductResponse(Product product) {
    return ProductResponse.builder()
        .id(product.getId())
        .name(product.getName())
        .description(product.getDescription())
        .price(product.getPrice())
        .build();
  }
}
