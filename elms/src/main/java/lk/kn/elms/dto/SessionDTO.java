package lk.kn.elms.dto;

import lombok.Data;
import java.time.LocalTime;

@Data
public class SessionDTO {
    private Long id;
    private LocalTime startTime;
    private LocalTime endTime;
    private String moduleCode;
    private String topic;
    private String lecturerName;
}
