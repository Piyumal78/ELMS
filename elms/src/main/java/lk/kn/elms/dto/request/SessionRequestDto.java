package lk.kn.elms.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SessionRequestDto {

    @NotNull(message = "Date is required")
    @FutureOrPresent(message = "Date must be today or a future date")
    private LocalDate date;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @NotNull(message = "Course ID is required")
    private Long courseId;

    @NotNull(message = "User ID is required")
    private Long userId;

}
