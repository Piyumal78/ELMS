package com.labassistant.service;

import com.labassistant.entity.Inventory;
import com.labassistant.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    public List<Inventory> getAllItems() {
        return inventoryRepository.findAll();
    }

    public Optional<Inventory> getItemById(Long id) {
        return inventoryRepository.findById(Objects.requireNonNull(id, "ID cannot be null"));
    }

    public Inventory createItem(Inventory inventory) {
        return Objects.requireNonNull(inventoryRepository.save(Objects.requireNonNull(inventory, "Inventory cannot be null")));
    }

    public Inventory updateItem(Long id, Inventory inventoryDetails) {
        Inventory inventory = inventoryRepository.findById(Objects.requireNonNull(id, "ID cannot be null"))
                .orElseThrow(() -> new RuntimeException("Inventory item not found with id: " + id));

        inventory.setName(inventoryDetails.getName());
        inventory.setCategory(inventoryDetails.getCategory());
        inventory.setQuantity(inventoryDetails.getQuantity());
        inventory.setMinimumStock(inventoryDetails.getMinimumStock());
        inventory.setStatus(inventoryDetails.getStatus());
        inventory.setDescription(inventoryDetails.getDescription());

        return inventoryRepository.save(inventory);
    }

    public void deleteItem(Long id) {
        Inventory inventory = inventoryRepository.findById(Objects.requireNonNull(id, "ID cannot be null"))
                .orElseThrow(() -> new RuntimeException("Inventory item not found with id: " + id));
        inventoryRepository.delete(Objects.requireNonNull(inventory));
    }

    public List<Inventory> getLowStockItems() {
        List<Inventory> allItems = inventoryRepository.findAll();
        return allItems.stream()
                .filter(item -> item.getQuantity() < item.getMinimumStock())
                .toList();
    }
}

