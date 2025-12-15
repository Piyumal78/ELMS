package com.labassistant.repository;

import com.labassistant.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    
    List<Inventory> findByStatus(String status);
    
    List<Inventory> findByCategory(String category);
    
    // Find items with low stock (quantity < minimumStock)
    List<Inventory> findByQuantityLessThan(Integer quantity);
}

