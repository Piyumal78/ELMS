package lk.kn.elms.service;

import lk.kn.elms.repository.InventoryRepository;
import lk.kn.elms.repository.RequestRepository;
import lk.kn.elms.repository.EquipmentRepository;
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

    @Autowired
    private lk.kn.elms.repository.SessionRepository sessionRepository;

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();

        // Total items
        long totalItems = inventoryRepository.count();
        stats.put("totalItems", totalItems);

        // Low stock count (Optimized Query)
        long lowStockCount = inventoryRepository.countLowStock();
        stats.put("lowStockCount", lowStockCount);

        // Pending requests (Optimized Count)
        long pendingRequests = requestRepository.countByStatus("Pending");
        stats.put("pendingRequests", pendingRequests);

        // Items under maintenance (Optimized Count)
        long itemsUnderMaintenance = equipmentRepository.countByStatus("Under Maintenance");
        stats.put("itemsUnderMaintenance", itemsUnderMaintenance);

        // Fetch Today's Sessions
        java.time.LocalDate today = java.time.LocalDate.now();
        java.util.List<lk.kn.elms.model.Session> sessions = sessionRepository.findByDate(today);

        java.util.List<lk.kn.elms.dto.SessionDTO> todaySessions = sessions.stream().map(session -> {
            lk.kn.elms.dto.SessionDTO dto = new lk.kn.elms.dto.SessionDTO();
            dto.setId(session.getId());
            dto.setStartTime(session.getStartTime());
            dto.setEndTime(session.getEndTime());
            dto.setModuleCode(session.getCourse().getCourseCode());
            dto.setTopic(session.getTitle());
            dto.setLecturerName(session.getCreatedUser().getName());
            return dto;
        }).collect(java.util.stream.Collectors.toList());

        stats.put("todaySessions", todaySessions);

        return stats;
    }
}
