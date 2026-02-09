package com.labassistant.service;

import com.labassistant.entity.Request;
import com.labassistant.entity.Inventory;
import com.labassistant.repository.RequestRepository;
import com.labassistant.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class RequestService {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    public List<Request> getAllRequests() {
        return requestRepository.findAll();
    }

    public Optional<Request> getRequestById(Long id) {
        return requestRepository.findById(Objects.requireNonNull(id, "ID cannot be null"));
    }

    public Request approveRequest(Long id) {
        Request request = requestRepository.findById(Objects.requireNonNull(id, "ID cannot be null"))
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + id));
        
        if (!"Pending".equalsIgnoreCase(request.getStatus())) {
            throw new RuntimeException("Only pending requests can be approved");
        }
        
        request.setStatus("Approved");
        return requestRepository.save(request);
    }

    public Request rejectRequest(Long id) {
        Request request = requestRepository.findById(Objects.requireNonNull(id, "ID cannot be null"))
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + id));
        
        if (!"Pending".equalsIgnoreCase(request.getStatus())) {
            throw new RuntimeException("Only pending requests can be rejected");
        }
        
        request.setStatus("Rejected");
        return requestRepository.save(request);
    }

    @Transactional
    public Request issueRequest(Long id) {
        Request request = requestRepository.findById(Objects.requireNonNull(id, "ID cannot be null"))
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + id));
        
        if (!"Approved".equalsIgnoreCase(request.getStatus())) {
            throw new RuntimeException("Only approved requests can be issued");
        }
        
        // Find and update inventory
        Inventory inventory = inventoryRepository.findAll().stream()
                .filter(item -> item.getName().equalsIgnoreCase(request.getItemName()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Inventory item not found: " + request.getItemName()));
        
        if (inventory.getQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock. Available: " + inventory.getQuantity() + ", Requested: " + request.getQuantity());
        }
        
        // Deduct from inventory
        inventory.setQuantity(inventory.getQuantity() - request.getQuantity());
        inventoryRepository.save(inventory);
        
        // Update request
        request.setStatus("Issued");
        request.setIssueDate(LocalDate.now());
        return requestRepository.save(request);
    }

    @Transactional
    public Request returnRequest(Long id) {
        Request request = requestRepository.findById(Objects.requireNonNull(id, "ID cannot be null"))
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + id));
        
        if (!"Issued".equalsIgnoreCase(request.getStatus())) {
            throw new RuntimeException("Only issued requests can be returned");
        }
        
        // Find and update inventory
        Inventory inventory = inventoryRepository.findAll().stream()
                .filter(item -> item.getName().equalsIgnoreCase(request.getItemName()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Inventory item not found: " + request.getItemName()));
        
        // Add back to inventory
        inventory.setQuantity(inventory.getQuantity() + request.getQuantity());
        inventoryRepository.save(inventory);
        
        // Update request
        request.setStatus("Returned");
        request.setReturnDate(LocalDate.now());
        return requestRepository.save(request);
    }
}

