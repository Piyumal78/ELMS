package lk.kn.elms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportSubmissionCreateResponseDto {

    private Long submissionId;
    private String fileUrl;
    private String filePublicId;
    private Long sessionId;
    private Long studentId;
    private LocalDateTime submittedAt;
}
