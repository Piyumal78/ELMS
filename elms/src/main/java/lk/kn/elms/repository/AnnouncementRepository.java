package lk.kn.elms.repository;

import lk.kn.elms.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    List<Announcement> findByCourseId(Long courseId);
    boolean existsByCourseId(Long courseId);
}
