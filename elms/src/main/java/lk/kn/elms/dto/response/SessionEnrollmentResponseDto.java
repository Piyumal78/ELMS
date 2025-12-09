package lk.kn.elms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SessionEnrollmentResponseDto {

    private Long enrollmentId;
    private Long sessionId;
    private Long studentId;
}
