package lk.kn.elms.repository;

import lk.kn.elms.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientRoleAndIsReadOrderByTimestampDesc(String recipientRole, boolean isRead);
}
