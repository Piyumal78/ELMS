package lk.kn.elms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SessionComponentResponseDto {

    private Long id;
    private Long sessionId;
    private List<SessionComponentItemResponseDto> sessionComponentItems;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

}
