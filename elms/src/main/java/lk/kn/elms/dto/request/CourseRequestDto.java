package lk.kn.elms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseRequestDto {

    @NotBlank(message = "Course code is required")
    @Pattern(
            regexp = "^[A-Z]{4} \\d{5}$",
            message = "Course code must be 4 capital letters, a space, and 5 digits (e.g., BECS 31613)"
    )
    private String courseCode;

    @NotBlank(message = "Course name is required")
    @Pattern(
            regexp = "^[A-Z].*$",
            message = "Course name must start with a capital letter"
    )
    private String courseName;

    @NotBlank(message = "Academic year is required")
    @Pattern(
            regexp = "^(20\\d{2})/(20\\d{2})$",
            message = "Academic year must be in the format YYYY/YYYY (e.g., 2023/2024)"
    )
    private String academicYear;


    @NotNull(message = "Lecturer ID is required")
    private Long lecturerId;
}
