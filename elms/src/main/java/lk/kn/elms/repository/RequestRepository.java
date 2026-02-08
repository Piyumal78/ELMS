package lk.kn.elms.repository;

import lk.kn.elms.model.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {

    List<Request> findByStatus(String status);

    List<Request> findByStudentId(String studentId);

    long countByStatus(String status);

    @org.springframework.data.jpa.repository.Query("SELECT i, SUM(r.quantity) as usageCount " +
            "FROM Request r, Inventory i " +
            "WHERE r.itemName = i.name " +
            "AND MONTH(r.requestDate) = MONTH(CURRENT_DATE) " +
            "AND YEAR(r.requestDate) = YEAR(CURRENT_DATE) " +
            "GROUP BY i " +
            "ORDER BY usageCount DESC")
    List<Object[]> findMonthlyUsage();
}
