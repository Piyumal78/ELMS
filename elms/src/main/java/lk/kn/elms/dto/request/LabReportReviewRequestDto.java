package lk.kn.elms.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LabReportReviewRequestDto {

    @Size(max = 500, message = "Comments cannot exceed 500 characters")
    private String comments;

    @NotBlank(message = "Grade is required")
    @Pattern(
            regexp = "A_PLUS|A|A_MINUS|B_PLUS|B|B_MINUS|C_PLUS|C|C_MINUS|D_PLUS|D|E",
            message = "Invalid grade value"
    )
    private String grade;

    @NotNull(message = "Demonstrator ID is required")
    @Positive(message = "Demonstrator ID must be a positive number")
    private Long demonstratorId;

    @NotNull(message = "Report Submission ID is required")
    @Positive(message = "Report Submission ID must be a positive number")
    private Long reportSubmissionId;

}
