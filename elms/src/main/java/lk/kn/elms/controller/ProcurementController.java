package lk.kn.elms.controller;

import lk.kn.elms.model.Procurement;
import lk.kn.elms.service.ProcurementService;
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

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveRequest(@PathVariable Long id) {
        System.out.println("Received approval request for ID: " + id);
        try {
            return ResponseEntity.ok(procurementService.approveRequest(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(procurementService.rejectRequest(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/receive")
    public ResponseEntity<?> receiveRequest(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(procurementService.receiveRequest(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
