package lk.kn.elms.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "sessions")
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"course", "createdUser", "reportSubmissions", "labManual","sessionEnrollments"})
@EntityListeners(AuditingEntityListener.class)
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "title")
    private String title;

    @Column(name = "experiment_number")
    private Integer experimentNumber;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne
    @JoinColumn(name = "created_user_id", nullable = false)
    private User createdUser;

    @OneToOne(mappedBy = "session", cascade = CascadeType.ALL)
    private LabManual labManual;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL)
    private List<ReportSubmission> reportSubmissions;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL)
    private List<SessionEnrollment> sessionEnrollments;

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
