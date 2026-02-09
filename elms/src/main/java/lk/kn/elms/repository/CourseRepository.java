package lk.kn.elms.repository;

import lk.kn.elms.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {

    boolean existsByCourseCodeAndAcademicYear(String courseCode, String academicYear);
    
    Optional<Course> findByCourseCode(String courseCode);

}
