package lk.kn.elms.repository;

import lk.kn.elms.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface SessionRepository extends JpaRepository<Session, Long> {

    @Query("""
    SELECT COUNT(s) > 0
    FROM Session s
    WHERE s.date = :date
      AND s.startTime <= :endTime
      AND s.endTime >= :startTime
      """)
    boolean existsOverlappingSession(
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

    boolean existsByCourse_CourseCodeAndExperimentNumber(String courseCode, Integer experimentNumber);

    @Query("SELECT s FROM Session s WHERE s.course.courseCode = :courseCode")
    List<Session> getSessionsByCourseCode(@Param("courseCode") String courseCode);

}
