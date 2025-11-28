package lk.kn.elms.model;

import jakarta.persistence.*;
import lk.kn.elms.model.enums.ReservationStatus;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@Entity
@Table(name = "lab_reservations")
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"student"})
@EntityListeners(AuditingEntityListener.class)
public class LabReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reservation_date")
    private LocalDate reservationDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "purpose")
    private String purpose;

    @Enumerated(EnumType.STRING)
    @Column(name = "reservation_status")
    private ReservationStatus Reservationstatus;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
}
