package lk.kn.elms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentResponseDto {

    private Long id;
    private String name;
    private String email;
    private String password;
    private String fileUrl;
    private String filePublicId;
    private List<StudentCourseResponseDto> courseResponseDtoList;
}
