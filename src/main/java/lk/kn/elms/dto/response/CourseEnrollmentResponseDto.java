package lk.kn.elms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseEnrollmentResponseDto {

    private Long enrollmentId;
    private Long courseId;
    private String courseName;
    private String courseCode;
    private Long studentId;
    private String studentName;
    private String studentNumber;
    private LocalDateTime enrollmentDate;
}
