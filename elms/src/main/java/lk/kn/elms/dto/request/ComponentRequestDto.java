package lk.kn.elms.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ComponentRequestDto {

    @NotBlank(message = "Component name is required")
    @Pattern(regexp = "^[A-Z_ ]+$", message = "Component name must be in capital letters only")
    private String componentName;

    private String type;

    @Min(value = 0, message = "Quantity cannot be negative")
    @NotNull(message = "Quantity is required")
    private Integer quantity;

}
