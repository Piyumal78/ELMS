package com.labassistant.controller;

import com.labassistant.entity.Procurement;
import com.labassistant.service.ProcurementService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/procurement")
@CrossOrigin(origins = "*")
public class ProcurementController {

    @Autowired
    private ProcurementService procurementService;

    @GetMapping
    public ResponseEntity<List<Procurement>> getAllRequests() {
        List<Procurement> requests = procurementService.getAllRequests();
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Procurement> getRequestById(@PathVariable Long id) {
        return procurementService.getRequestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Procurement> createRequest(@Valid @RequestBody Procurement procurement) {
        Procurement createdRequest = procurementService.createRequest(procurement);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRequest);
    }
}

