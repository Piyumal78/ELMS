package com.labassistant.service;

import com.labassistant.repository.InventoryRepository;
import com.labassistant.repository.RequestRepository;
import com.labassistant.repository.EquipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private EquipmentRepository equipmentRepository;

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Total items
        long totalItems = inventoryRepository.count();
        stats.put("totalItems", totalItems);
        
        // Low stock count
        long lowStockCount = inventoryRepository.findAll().stream()
                .filter(item -> item.getQuantity() < item.getMinimumStock())
                .count();
        stats.put("lowStockCount", lowStockCount);
        
        // Pending requests
        long pendingRequests = requestRepository.findByStatus("Pending").size();
        stats.put("pendingRequests", pendingRequests);
        
        // Items under maintenance
        long itemsUnderMaintenance = equipmentRepository.findByStatus("Under Maintenance").size();
        stats.put("itemsUnderMaintenance", itemsUnderMaintenance);
        
        return stats;
    }
}

