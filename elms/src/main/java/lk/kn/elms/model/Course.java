package lk.kn.elms.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "courses")
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"courseEnrollments", "sessions", "labManuals", "lecturer"})
@EntityListeners(AuditingEntityListener.class)
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "course_code", nullable = false, unique = true)
    private String courseCode;

    @Column(name = "course_name",nullable = false)
    private String courseName;

    @Column(name = "academic_year", nullable = false)
    private String academicYear;

    @ManyToOne
    @JoinColumn(name = "lecturer_id", nullable = false)
    private Lecturer lecturer;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<CourseEnrollment> courseEnrollments;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<Session> sessions;

//    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
//    private List<LabManual> labManuals;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<Announcement> announcements;

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
