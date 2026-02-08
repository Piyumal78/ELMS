package lk.kn.elms.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "recipient_role", nullable = false, columnDefinition = "VARCHAR(255) DEFAULT 'LAB_ASSISTANT'")
    private String recipientRole; // "LAB_ASSISTANT"

    @Column(name = "is_read", nullable = false, columnDefinition = "BIT(1) DEFAULT 0")
    private boolean isRead = false;

    @Column(name = "timestamp", nullable = false, columnDefinition = "datetime(6) DEFAULT CURRENT_TIMESTAMP(6)")
    private LocalDateTime timestamp;

    public Notification(String message, String recipientRole) {
        this.message = message;
        this.recipientRole = recipientRole;
        this.timestamp = LocalDateTime.now();
        this.isRead = false;
    }
}
