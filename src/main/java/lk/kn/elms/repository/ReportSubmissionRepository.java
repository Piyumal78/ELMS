package lk.kn.elms.repository;

import lk.kn.elms.model.ReportSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportSubmissionRepository extends JpaRepository<ReportSubmission, Long> {

    boolean existsByStudentIdAndSessionId(Long studentId, Long sessionId);
}
