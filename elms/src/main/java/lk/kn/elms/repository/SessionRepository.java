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
      @Param("endTime") LocalTime endTime);

  boolean existsByCourse_CourseCodeAndExperimentNumber(String courseCode, Integer experimentNumber);

  boolean existsByCourse_IdAndExperimentNumber(Long courseId, Integer experimentNumber);

  @Query("SELECT s FROM Session s WHERE s.course.courseCode = :courseCode")
  List<Session> getSessionsByCourseCode(@Param("courseCode") String courseCode);

  List<Session> findByDate(LocalDate date);

  // Demonstrator Dashboard Statistics
  @Query("SELECT COUNT(s) FROM Session s WHERE s.createdUser.id = :demonstratorId AND s.date BETWEEN :semesterStart AND :semesterEnd")
  long countActiveSessions(
      @Param("demonstratorId") Long demonstratorId,
      @Param("semesterStart") LocalDate semesterStart,
      @Param("semesterEnd") LocalDate semesterEnd);

  @Query("SELECT s FROM Session s WHERE s.createdUser.id = :demonstratorId")
  List<Session> findByDemonstratorId(@Param("demonstratorId") Long demonstratorId);

  @Query("SELECT COUNT(DISTINCT s.course) FROM Session s WHERE s.createdUser.id = :demonstratorId")
  long countDistinctCoursesByDemonstratorId(@Param("demonstratorId") Long demonstratorId);
}
