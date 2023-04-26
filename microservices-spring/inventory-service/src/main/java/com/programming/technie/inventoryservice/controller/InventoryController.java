package com.programming.technie.inventoryservice.controller;

import com.programming.technie.inventoryservice.dto.InventoryResponse;
import com.programming.technie.inventoryservice.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@Slf4j
public class InventoryController {

    private final InventoryService inventoryService;

    // http://localhost:8082/api/inventory?skuCode=iphone-13&skuCode=iphone13-red
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<InventoryResponse> isInStock(@RequestParam("skuCode") List<String> skuCodes){
        log.info("Received inventory check request for skuCode: {}", skuCodes);
        return inventoryService.isInStock(skuCodes);
    }
}
