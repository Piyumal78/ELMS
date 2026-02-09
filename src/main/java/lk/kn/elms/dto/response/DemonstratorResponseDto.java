package lk.kn.elms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DemonstratorResponseDto {

    private Long demonstratorId;
    private String registrationNumber;
    private String name;
    private String email;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

}
