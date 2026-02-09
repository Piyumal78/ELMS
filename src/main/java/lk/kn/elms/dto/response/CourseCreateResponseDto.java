package lk.kn.elms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseCreateResponseDto {

    private Long courseId;
    private String courseCode;
    private String courseName;
    private String academicYear;
    private Long lecturerId;
    private String lecturerName;
}
