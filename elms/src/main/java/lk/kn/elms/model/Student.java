package lk.kn.elms.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "students")
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"componentHandovers", "courseEnrollments", "sessionEnrollments", "reportSubmissions", "labReservations"})
@DiscriminatorValue("STUDENT")
@PrimaryKeyJoinColumn(name = "id")
public class Student extends User{

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<ComponentHandover> componentHandovers;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<CourseEnrollment> courseEnrollments;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<SessionEnrollment> sessionEnrollments;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<ReportSubmission> reportSubmissions;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<LabReservation> labReservations;

}
