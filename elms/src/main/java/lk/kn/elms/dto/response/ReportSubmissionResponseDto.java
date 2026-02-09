package lk.kn.elms.dto.response;

import lk.kn.elms.model.enums.Grade;
import lk.kn.elms.model.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportSubmissionResponseDto {
    private Long id;
    private Long studentId;
    private String studentName; // Assuming you want student name, otherwise can be just ID
    private String fileUrl;
    private Status status;
    private LocalDateTime submittedAt;
    private Grade grade;
    private String comments;
}
