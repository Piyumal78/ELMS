package lk.kn.elms.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentUpdateRequestDto {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    @Pattern(
            regexp = "^[A-Za-z .]{2,50}$",
            message = "Name can only contain letters, spaces, and dots"
    )
    private String name;

    @NotBlank(message = "Existing password is required!")
    private String existingPassword;

    @NotBlank(message = "New password is required!")
    private String newPassword;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Pattern(
            regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$",
            message = "Invalid email format"
    )
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;

}
