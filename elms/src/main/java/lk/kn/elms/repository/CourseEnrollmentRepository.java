package lk.kn.elms.repository;

import lk.kn.elms.model.CourseEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, Long> {

    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);

    List<CourseEnrollment> findByStudentId(Long studentId);

    List<CourseEnrollment> findByCourseId(Long courseId);

    @Query("SELECT ce FROM CourseEnrollment ce WHERE ce.student.registrationNumber = :registrationNumber AND ce.course.courseCode = :courseCode")
    Optional<CourseEnrollment> findByStudentNumberAndCourseCode(@Param("registrationNumber") String registrationNumber, @Param("courseCode") String courseCode);
}
