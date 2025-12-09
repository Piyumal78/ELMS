package lk.kn.elms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SessionCreateResponseDto {

    private Long sessionId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String fileUrl;
    private String filePublicId;
    private Long courseId;
    private String courseCode;
    private String courseName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
