package com.programming.technie.inventoryservice.repository;

import com.programming.technie.inventoryservice.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
  List<Inventory> findBySkuCodeIn(List<String> skuCodes);
}
