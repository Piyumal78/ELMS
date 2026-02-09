package lk.kn.elms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnnouncementRequestDto {

    @NotNull(message = "Course ID is required!")
    private Long courseId;

    @NotBlank(message = "Announcement content is required!")
    private String content;

}
