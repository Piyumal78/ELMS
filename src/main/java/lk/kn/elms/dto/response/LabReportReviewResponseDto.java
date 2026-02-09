package lk.kn.elms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LabReportReviewResponseDto {

    private Long labReportReviewId;
    private String comment;
    private String grade;
    private Long demonstratorId;
    private String demonstratorName;
    private Long reportSubmissionId;
    private LocalDateTime reviewedAt;
}
