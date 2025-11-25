package com.labassistant.service;

import com.labassistant.entity.Procurement;
import com.labassistant.repository.ProcurementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ProcurementService {

    @Autowired
    private ProcurementRepository procurementRepository;

    public List<Procurement> getAllRequests() {
        return procurementRepository.findAll();
    }

    public Optional<Procurement> getRequestById(Long id) {
        return procurementRepository.findById(Objects.requireNonNull(id, "ID cannot be null"));
    }

    public Procurement createRequest(Procurement procurement) {
        return Objects.requireNonNull(procurementRepository.save(Objects.requireNonNull(procurement, "Procurement cannot be null")));
    }

    public List<Procurement> getRequestsByStatus(String status) {
        return procurementRepository.findByStatus(status);
    }
}

