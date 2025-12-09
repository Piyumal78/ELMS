package lk.kn.elms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StaffCreateResponseDto {

    private Long staffId;
    private String registrationNumber;
    private String name;
    private String email;
    private String phoneNumber;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

}
