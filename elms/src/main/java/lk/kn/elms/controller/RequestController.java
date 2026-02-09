package lk.kn.elms.controller;

import lk.kn.elms.dto.RequestDTO;
import lk.kn.elms.exception.ResourceInsufficientException;
import lk.kn.elms.model.Request;
import lk.kn.elms.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/elms/api/requests")
@CrossOrigin(origins = "*")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @GetMapping
    public List<Request> getAllRequests() {
        return requestService.getAllRequests();
    }

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody RequestDTO dto) {
        try {
            Request request = requestService.createRequest(dto);
            return new ResponseEntity<>(request, HttpStatus.CREATED);
        } catch (ResourceInsufficientException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(java.util.Map.of("message", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveRequest(@PathVariable("id") Long id) {
        try {
            Request request = requestService.approveRequest(id);
            return ResponseEntity.ok(request);
        } catch (ResourceInsufficientException e) {
            // Return error as JSON object
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(java.util.Map.of("message", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable("id") Long id) {
        try {
            Request request = requestService.rejectRequest(id);
            return ResponseEntity.ok(request);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/issue")
    public ResponseEntity<?> issueRequest(@PathVariable("id") Long id) {
        try {
            Request request = requestService.issueRequest(id);
            return ResponseEntity.ok(request);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/return")
    public ResponseEntity<?> returnRequest(@PathVariable("id") Long id,
            @RequestParam(value = "isDamaged", required = false) Boolean isDamaged) {
        try {
            Request request = requestService.returnRequest(id, isDamaged);
            return ResponseEntity.ok(request);
        } catch (RuntimeException e) {
            // "Request must be ISSUED before returning" or "Inventory not found"
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(java.util.Map.of("message", e.getMessage()));
        }
    }
}
