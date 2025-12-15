package lk.kn.elms.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "experiment_components")
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"session", "sessionComponentItems", "componentHandovers"})
@EntityListeners(AuditingEntityListener.class)
public class SessionComponent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "amount")
    private Integer amount;

    @OneToMany(mappedBy = "sessionComponent", cascade = CascadeType.ALL)
    private List<ComponentHandover> componentHandovers;

    @OneToOne
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @OneToMany(mappedBy = "sessionComponent", cascade = CascadeType.ALL)
    private List<SessionComponentItem> sessionComponentItems;

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
