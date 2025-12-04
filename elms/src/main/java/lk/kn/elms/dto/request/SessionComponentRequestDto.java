package lk.kn.elms.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SessionComponentRequestDto {

    @NotNull(message = "Session components list is required")
    @Size(min = 1, message = "At least one component must be provided")
    @Valid
    private List<SessionComponentItemRequestDto> sessionComponentItems;
}
