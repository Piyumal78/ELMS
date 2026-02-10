package lk.kn.elms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentPhotoResponseDto {

    private Long studentId;
    private String fileUrl;
    private String filePublicId;
}
