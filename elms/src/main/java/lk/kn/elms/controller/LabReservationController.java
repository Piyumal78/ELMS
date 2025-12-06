package lk.kn.elms.controller;

import jakarta.validation.Valid;
import lk.kn.elms.dto.request.LabReservationRequestDto;
import lk.kn.elms.dto.response.LabReservationResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.service.LabReservationService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@AllArgsConstructor
@CrossOrigin("*")
@RequestMapping(value = "elms/api")
public class LabReservationController {

    private LabReservationService labReservationService;

    @PostMapping("/lab-reservations")
    public ResponseEntity<LabReservationResponseDto> createLabReservation(
            @Valid @RequestBody LabReservationRequestDto labReservationRequestDto) throws ResourceAlreadyExistsException, ResourceNotFoundException {

        LabReservationResponseDto responseDto = labReservationService.createLabReservation(labReservationRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @PutMapping("/lab-reservations/{reservationId}")
    public ResponseEntity<LabReservationResponseDto> updateLabReservation(
            @PathVariable Long reservationId,
            @Valid @RequestBody LabReservationRequestDto labReservationRequestDto) throws ResourceNotFoundException, ResourceAlreadyExistsException {
        LabReservationResponseDto responseDto = labReservationService.updateLabReservation(reservationId, labReservationRequestDto);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @PostMapping("/lab-reservations/{reservationId}/approve")
    public ResponseEntity<LabReservationResponseDto> approveLabReservation(@PathVariable Long reservationId) throws ResourceNotFoundException {
        LabReservationResponseDto responseDto = labReservationService.approveLabReservation(reservationId);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @PostMapping("/lab-reservations/{reservationId}/reject")
    public ResponseEntity<LabReservationResponseDto> rejectLabReservation(@PathVariable Long reservationId) throws ResourceNotFoundException {
        LabReservationResponseDto responseDto = labReservationService.rejectLabReservation(reservationId);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @PostMapping("/lab-reservations/{reservationId}/cancel")
    public ResponseEntity<LabReservationResponseDto> cancelLabReservation(@PathVariable Long reservationId) throws ResourceNotFoundException {
        LabReservationResponseDto responseDto = labReservationService.cancelLabReservation(reservationId);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @PostMapping("/lab-reservations/{reservationId}/complete")
    public ResponseEntity<LabReservationResponseDto> completeLabReservation(@PathVariable Long reservationId) throws ResourceNotFoundException {
        LabReservationResponseDto responseDto = labReservationService.completeLabReservation(reservationId);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @GetMapping("/lab-reservations/{reservationId}")
    public ResponseEntity<LabReservationResponseDto> getLabReservationById(@PathVariable Long reservationId) throws ResourceNotFoundException {
        LabReservationResponseDto responseDto = labReservationService.getLabReservationById(reservationId);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @GetMapping("/lab-reservations/pending")
    public ResponseEntity<List<LabReservationResponseDto>> getAllPendingLabReservations() throws ResourceNotFoundException {
        List<LabReservationResponseDto> responseDtoList = labReservationService.getAllPendingLabReservations();
        return ResponseEntity.status(HttpStatus.OK).body(responseDtoList);
    }

    @GetMapping("/lab-reservations/approved")
    public ResponseEntity<List<LabReservationResponseDto>> getAllApprovedLabReservations() throws ResourceNotFoundException {
        List<LabReservationResponseDto> responseDtoList = labReservationService.getAllApprovedLabReservations();
        return ResponseEntity.status(HttpStatus.OK).body(responseDtoList);
    }

    @GetMapping("/lab-reservations/date/{reservationDate}")
    public ResponseEntity<List<LabReservationResponseDto>> getLabReservationsByDate(@PathVariable LocalDate reservationDate) throws ResourceNotFoundException {
        List<LabReservationResponseDto> responseDtoList = labReservationService.getLabReservationsByDate(reservationDate);
        return ResponseEntity.status(HttpStatus.OK).body(responseDtoList);
    }

    @GetMapping("/lab-reservations/{reservationId}/delete")
    public ResponseEntity<String> deleteLabReservation(@PathVariable Long reservationId) throws ResourceNotFoundException {
        labReservationService.deleteLabReservation(reservationId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Lab reservation deleted successfully.");
    }
}
