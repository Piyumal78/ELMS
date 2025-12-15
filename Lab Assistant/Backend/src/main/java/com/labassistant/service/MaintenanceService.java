package com.labassistant.service;

import com.labassistant.entity.Equipment;
import com.labassistant.repository.EquipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class MaintenanceService {

    @Autowired
    private EquipmentRepository equipmentRepository;

    public List<Equipment> getAllEquipment() {
        return equipmentRepository.findAll();
    }

    public Optional<Equipment> getEquipmentById(Long id) {
        return equipmentRepository.findById(Objects.requireNonNull(id, "ID cannot be null"));
    }

    public Equipment updateStatus(Long id, String status) {
        Equipment equipment = equipmentRepository.findById(Objects.requireNonNull(id, "ID cannot be null"))
                .orElseThrow(() -> new RuntimeException("Equipment not found with id: " + id));
        
        equipment.setStatus(status);
        
        // Update last maintenance date if status is "Under Maintenance"
        if ("Under Maintenance".equalsIgnoreCase(status)) {
            equipment.setLastMaintenanceDate(LocalDate.now());
        }
        
        return equipmentRepository.save(equipment);
    }

    public List<Equipment> getEquipmentByStatus(String status) {
        return equipmentRepository.findByStatus(status);
    }
}

