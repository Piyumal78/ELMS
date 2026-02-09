package lk.kn.elms.service;

import lk.kn.elms.model.Notification;
import lk.kn.elms.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public void createNotification(String message, String recipientRole) {
        Notification notification = new Notification(message, recipientRole);
        notificationRepository.save(notification);
    }

    public List<Notification> getUnreadNotifications(String recipientRole) {
        return notificationRepository.findByRecipientRoleAndIsReadOrderByTimestampDesc(recipientRole, false);
    }

    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    public void deleteNotification(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new RuntimeException("Notification not found");
        }
        notificationRepository.deleteById(id);
    }
}
