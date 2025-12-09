package lk.kn.elms.controller;

import jakarta.validation.Valid;
import lk.kn.elms.dto.request.StaffRequestDto;
import lk.kn.elms.dto.response.StaffCreateResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.service.StaffService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@CrossOrigin("*")
@RequestMapping(value = "/elms/api")
public class StaffController {

    private StaffService staffService;

    @PostMapping("/staff")
    public ResponseEntity<StaffCreateResponseDto> createStaff(
            @Valid @RequestBody StaffRequestDto staffRequestDto) throws ResourceAlreadyExistsException {
        StaffCreateResponseDto responseDto = staffService.createStaff(staffRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }
}
