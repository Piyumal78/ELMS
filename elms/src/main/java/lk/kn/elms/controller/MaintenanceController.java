package lk.kn.elms.controller;

import lk.kn.elms.model.Equipment;
import lk.kn.elms.service.MaintenanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/elms/api/maintenance")
@CrossOrigin(origins = "*")
public class MaintenanceController {

    @Autowired
    private MaintenanceService maintenanceService;

    @GetMapping
    public ResponseEntity<List<Equipment>> getAllEquipment() {
        List<Equipment> equipment = maintenanceService.getAllEquipment();
        return ResponseEntity.ok(equipment);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Equipment> getEquipmentById(@PathVariable Long id) {
        return maintenanceService.getEquipmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Equipment> createEquipment(@RequestBody Equipment equipment) {
        Equipment createdEquipment = maintenanceService.createEquipment(equipment);
        return ResponseEntity.ok(createdEquipment);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Equipment> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            if (status == null || status.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            Equipment equipment = maintenanceService.updateStatus(id, status);
            return ResponseEntity.ok(equipment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
