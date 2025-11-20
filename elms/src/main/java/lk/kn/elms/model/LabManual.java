package lk.kn.elms.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "lab_manuals")
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"course", "session"})
@EntityListeners(AuditingEntityListener.class)
public class LabManual {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "experiment_number")
    private Integer experimentNumber;

    @Column(name = "file_url")
    private String fileUrl;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @OneToOne
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
