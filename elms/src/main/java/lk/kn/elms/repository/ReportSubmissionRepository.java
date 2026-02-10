package lk.kn.elms.repository;

import lk.kn.elms.model.ReportSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReportSubmissionRepository extends JpaRepository<ReportSubmission, Long> {

    boolean existsByStudentIdAndSessionId(Long studentId, Long sessionId);

    java.util.List<ReportSubmission> findBySessionId(Long sessionId);


    // Demonstrator Dashboard Statistics
    @Query("SELECT COUNT(rs) FROM ReportSubmission rs WHERE rs.session.createdUser.id = :demonstratorId AND rs.status = lk.kn.elms.model.enums.Status.PENDING")
    long countPendingReportsByDemonstratorId(@Param("demonstratorId") Long demonstratorId);
}
