package lk.kn.elms.service;

import lk.kn.elms.repository.InventoryRepository;
import lk.kn.elms.repository.RequestRepository;
import lk.kn.elms.repository.EquipmentRepository;
import lk.kn.elms.repository.ReportSubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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

    @Autowired
    private ReportSubmissionRepository reportSubmissionRepository;

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();

        // Total items (excluding deleted items)
        long totalItems = inventoryRepository.findAll().stream()
                .filter(item -> !"Deleted".equals(item.getStatus()))
                .count();
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

    public Map<String, Object> getDemonstratorStats(Long demonstratorId) {
        Map<String, Object> stats = new HashMap<>();

        // Calculate semester dates (assuming current semester is Feb-Jun or Aug-Dec)
        LocalDate today = LocalDate.now();
        LocalDate semesterStart;
        LocalDate semesterEnd;

        int currentMonth = today.getMonthValue();
        if (currentMonth >= 2 && currentMonth <= 6) {
            // First semester (Feb-Jun)
            semesterStart = LocalDate.of(today.getYear(), 2, 1);
            semesterEnd = LocalDate.of(today.getYear(), 6, 30);
        } else {
            // Second semester (Aug-Dec) or Jan (from previous semester)
            if (currentMonth == 1) {
                semesterStart = LocalDate.of(today.getYear() - 1, 8, 1);
                semesterEnd = LocalDate.of(today.getYear() - 1, 12, 31);
            } else {
                semesterStart = LocalDate.of(today.getYear(), 8, 1);
                semesterEnd = LocalDate.of(today.getYear(), 12, 31);
            }
        }

        // Active Sessions (sessions in current semester)
        long activeSessions = sessionRepository.countActiveSessions(demonstratorId, semesterStart, semesterEnd);
        stats.put("activeSessions", activeSessions);

        // Pending Reports
        long pendingReports = reportSubmissionRepository.countPendingReportsByDemonstratorId(demonstratorId);
        stats.put("pendingReports", pendingReports);

        // My Courses (distinct courses assigned to demonstrator)
        long myCourses = sessionRepository.countDistinctCoursesByDemonstratorId(demonstratorId);
        stats.put("myCourses", myCourses);

        return stats;
    }
}
