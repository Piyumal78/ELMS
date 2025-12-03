package lk.kn.elms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnnouncementResponseDto {

    private Long id;
    private String content;
    private String courseCode;
    private String courseTitle;
    private String announcerName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
