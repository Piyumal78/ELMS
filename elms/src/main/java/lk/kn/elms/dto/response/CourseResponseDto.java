package lk.kn.elms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseResponseDto {

    private Long courseId;
    private String courseCode;
    private String courseName;
    private LecturerResponseDto lecturer;

}
