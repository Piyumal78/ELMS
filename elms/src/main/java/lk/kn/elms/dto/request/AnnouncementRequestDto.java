package lk.kn.elms.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnnouncementRequestDto {

    @NotBlank(message = "Course ID is required!")
    private Long courseId;

    @NotBlank(message = "User ID is required!")
    private Long userId;

    @NotBlank(message = "Announcement content is required!")
    private String content;

}
