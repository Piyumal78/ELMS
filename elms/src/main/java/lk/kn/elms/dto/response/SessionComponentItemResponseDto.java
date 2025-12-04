package lk.kn.elms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SessionComponentItemResponseDto {

    private Long id;
    private Integer quantity;
    private String componentName;
    private String type;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}
