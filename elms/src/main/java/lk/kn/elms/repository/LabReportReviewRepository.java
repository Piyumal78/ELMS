package lk.kn.elms.repository;

import lk.kn.elms.model.LabReportReview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface LabReportReviewRepository extends JpaRepository<LabReportReview, Long> {

    Boolean existsByReportSubmissionId(Long reportSubmissionId);

    Optional<LabReportReview> findByReportSubmissionId(Long reportSubmissionId);

    List<LabReportReview> findByReportSubmissionStudentIdOrderByReviewedAtDesc(Long studentId);
    
}
