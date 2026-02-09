package lk.kn.elms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentDetailUpdateResponseDto {

    private Long studentId;
    private String password;
    private String name;
    private String email;

}
