package lk.kn.elms.controller;

import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lk.kn.elms.dto.request.DemonstratorRequestDto;
import lk.kn.elms.dto.response.DemonstratorResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.service.DemonstratorService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@CrossOrigin("*")
@RequestMapping(value = "elms/api")
public class DemonstratorController {

    private DemonstratorService demonstratorService;

    @RolesAllowed({"ADMIN"})
    @PostMapping(value = "/demonstrators")
    public ResponseEntity<DemonstratorResponseDto> createDemonstrator(
            @Valid @RequestBody DemonstratorRequestDto demonstratorRequestDto) throws ResourceAlreadyExistsException {
        DemonstratorResponseDto demonstratorResponseDto = demonstratorService.createDemonstrator(demonstratorRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(demonstratorResponseDto);
    }

    @RolesAllowed({"ADMIN"})
    @PutMapping(value = "/demonstrators/{demonstratorId}")
    public ResponseEntity<DemonstratorResponseDto> updateDemonstrator(
            @PathVariable Long demonstratorId,
            @Valid @RequestBody DemonstratorRequestDto demonstratorRequestDto) throws ResourceNotFoundException {
        DemonstratorResponseDto demonstratorResponseDto = demonstratorService.updateDemonstrator(demonstratorId, demonstratorRequestDto);
        return ResponseEntity.status(HttpStatus.OK).body(demonstratorResponseDto);
    }

    @RolesAllowed({"ADMIN","DEMONSTRATOR","LECTURER"})
    @GetMapping(value = "/demonstrators/registration-number/{registrationNumber}")
    public ResponseEntity<DemonstratorResponseDto> getDemonstratorByRegistrationNumber(
            @PathVariable String registrationNumber) throws ResourceNotFoundException {
        DemonstratorResponseDto demonstratorResponseDto = demonstratorService.getDemonstratorByRegistrationNumber(registrationNumber);
        return ResponseEntity.status(HttpStatus.OK).body(demonstratorResponseDto);
    }

    @RolesAllowed({"ADMIN","DEMONSTRATOR","LECTURER"})
    @GetMapping(value = "/demonstrators/{demonstratorId}")
    public ResponseEntity<DemonstratorResponseDto> getDemonstratorById(
            @PathVariable Long demonstratorId) throws ResourceNotFoundException {
        DemonstratorResponseDto demonstratorResponseDto = demonstratorService.getDemonstratorById(demonstratorId);
        return ResponseEntity.status(HttpStatus.OK).body(demonstratorResponseDto);
    }

    @RolesAllowed({"ADMIN","DEMONSTRATOR","LECTURER"})
    @GetMapping(value = "/demonstrators")
    public ResponseEntity<List<DemonstratorResponseDto>> getAllDemonstrators() throws ResourceNotFoundException {
        List<DemonstratorResponseDto> demonstrators = demonstratorService.getAllDemonstrators();
        return ResponseEntity.status(HttpStatus.OK).body(demonstrators);
    }

    @RolesAllowed({"ADMIN"})
    @DeleteMapping(value = "/demonstrators/{demonstratorId}")
    public ResponseEntity<String> deleteDemonstrator(
            @PathVariable Long demonstratorId) throws ResourceNotFoundException {
        demonstratorService.deleteDemonstrator(demonstratorId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Demonstrator with ID " + demonstratorId + " has been deleted.");
    }

}
