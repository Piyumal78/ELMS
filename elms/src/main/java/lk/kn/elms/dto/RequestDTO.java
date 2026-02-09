package lk.kn.elms.dto;

import lombok.Data;

@Data
public class RequestDTO {
    private String studentId;
    private String studentName;
    private String itemName;
    private Integer quantity;
    private String purpose;
}
