package lk.kn.elms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ComponentResponseDto {

    private Long componentId;
    private String componentName;
    private String type;
    private Integer quantity;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
