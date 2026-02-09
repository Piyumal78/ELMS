package lk.kn.elms.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_reg_no", nullable = false)
    private String studentId; // e.g., "STU001" (Registration Number)

    @Column(name = "student_id")
    private Long userId; // DB Foreign Key Support (Numeric ID)

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    @Column(name = "student_name", nullable = false)
    private String studentName; // "Student/Lecturer"

    @Column(name = "item_name", nullable = false)
    private String itemName; // Must match Inventory item name

    @Column(name = "inventory_id")
    private Long inventoryId; // DB Constraint Support

    @Column(nullable = false)
    private Integer quantity;

    @Column(columnDefinition = "TEXT")
    private String purpose;

    @Column(name = "request_date", nullable = false)
    private LocalDate requestDate;

    @Column(nullable = false)
    private String status; // Default: "PENDING"
}
