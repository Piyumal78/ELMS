package lk.kn.elms.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StaffRequestDto {

    @Pattern(
            regexp = "^STF-\\d{4}-\\d{3}$",
            message = "Invalid staff registration number. Expected format: STF-YYYY-NNN"
    )
    private String registrationNumber;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    @Pattern(
            regexp = "^[A-Za-z .]{2,50}$",
            message = "Name can only contain letters, spaces, and dots"
    )
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^(?:0|\\+94|94)?7[0-9]{8}$",
            message = "Invalid Sri Lankan phone number"
    )
    private String phoneNumber;


}
