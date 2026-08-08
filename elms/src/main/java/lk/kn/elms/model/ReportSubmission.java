package lk.kn.elms.model;

import jakarta.persistence.*;
import lk.kn.elms.model.enums.Status;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "report_submissions")
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = { "labReportReview", "session", "student" })
@EntityListeners(AuditingEntityListener.class)
public class ReportSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_url")
    private String fileUrl;

    @Column(name = "file_public_id")
    private String filePublicId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status = Status.PENDING;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @OneToOne(mappedBy = "reportSubmission", cascade = CascadeType.ALL)
    private LabReportReview labReportReview;

    @CreatedDate
    @Column(name = "submitted_at", updatable = false, nullable = false)
    private LocalDateTime submittedAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
