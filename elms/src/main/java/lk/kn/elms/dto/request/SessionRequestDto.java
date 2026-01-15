package lk.kn.elms.dto.request;

import jakarta.validation.constraints.*;
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

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Experiment number is required")
    @Min(value = 1, message = "Experiment number must be at least 1")
    @Max(value = 20, message = "Experiment number must be less than 20")
    private Integer experimentNumber;


    @NotNull(message = "Course ID is required")
    private Long courseId;

    @NotNull(message = "User ID is required")
    private Long userId;

}
