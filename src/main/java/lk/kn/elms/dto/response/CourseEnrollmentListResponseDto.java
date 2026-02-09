package lk.kn.elms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseEnrollmentListResponseDto {

    private List<CourseEnrollmentResponseDto> enrollmentResponseDtoList;
    private Integer totalEnrollments;
}
