package lk.kn.elms.model;

import jakarta.persistence.*;
import lk.kn.elms.model.enums.Grade;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "lab_report_reviews")
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"demonstrator", "reportSubmission"})
@EntityListeners(AuditingEntityListener.class)
public class LabReportReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "comments")
    private String comments;

    @Column(name = "grade")
    @Enumerated(EnumType.STRING)
    private Grade grade;

    @ManyToOne
    @JoinColumn(name = "demonstrator_id", nullable = false)
    private Demonstrator demonstrator;

    @OneToOne
    @JoinColumn(name = "report_submission_id", nullable = false)
    private ReportSubmission reportSubmission;

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
