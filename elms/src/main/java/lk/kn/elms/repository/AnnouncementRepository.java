package lk.kn.elms.repository;

import lk.kn.elms.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    List<Announcement> findByCourseId(Long courseId);
    boolean existsByCourseId(Long courseId);

    @Query("SELECT a FROM Announcement a WHERE a.course.courseCode = :courseCode")
    List<Announcement> findByCourseCourseCode(String courseCode);
}
