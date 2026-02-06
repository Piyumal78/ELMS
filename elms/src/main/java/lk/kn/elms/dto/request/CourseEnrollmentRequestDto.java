package lk.kn.elms.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseEnrollmentRequestDto {

    @NotNull(message = "Student registration number is required")
    private String studentNumber;

    @NotNull(message = "Course code is required")
    private String courseCode;
}
