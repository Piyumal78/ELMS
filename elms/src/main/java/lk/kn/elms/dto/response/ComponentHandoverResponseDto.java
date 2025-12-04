package lk.kn.elms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ComponentHandoverResponseDto {

    private Long id;
    private Long sessionComponentId;
    private String registrationNumber;
    private String returnStatus;
    private LocalDateTime handedOverDate;

}
