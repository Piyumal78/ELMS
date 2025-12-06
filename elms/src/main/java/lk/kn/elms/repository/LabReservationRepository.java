package lk.kn.elms.repository;

import lk.kn.elms.model.LabReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface LabReservationRepository extends JpaRepository<LabReservation, Long> {

    @Query("""
    SELECT r FROM LabReservation r
    WHERE r.reservationDate = :reservationDate
      AND r.startTime < :endTime
      AND r.endTime > :startTime""")
    List<LabReservation> findOverlappingReservations(LocalDate reservationDate, LocalTime startTime, LocalTime endTime);

    @Query("SELECT r FROM LabReservation r WHERE r.reservationStatus = 'PENDING'")
    List<LabReservation> findAllPendingReservations();

    @Query("SELECT r FROM LabReservation r WHERE r.reservationStatus = 'APPROVED'")
    List<LabReservation> findAllApprovedReservations();

    List<LabReservation> findAllByReservationDate(LocalDate reservationDate);


}
