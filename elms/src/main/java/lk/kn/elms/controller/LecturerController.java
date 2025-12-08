package lk.kn.elms.controller;

import jakarta.validation.Valid;
import lk.kn.elms.dto.request.LecturerRequestDto;
import lk.kn.elms.dto.response.LecturerResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.service.LecturerService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@CrossOrigin("*")
@RequestMapping(value = "/elms/api")
public class LecturerController {

    private LecturerService lecturerService;

    @PostMapping("/lecturers")
    public ResponseEntity<LecturerResponseDto> createLecturer(
            @Valid @RequestBody LecturerRequestDto lecturerRequestDto) throws ResourceAlreadyExistsException {
        LecturerResponseDto responseDto = lecturerService.createLecturer(lecturerRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @PutMapping("/lecturers/{lecturerId}")
    public ResponseEntity<LecturerResponseDto> updateLecturer(
            @PathVariable Long lecturerId,
            @Valid @RequestBody LecturerRequestDto lecturerRequestDto) throws ResourceNotFoundException {
        LecturerResponseDto responseDto = lecturerService.updateLecturer(lecturerId, lecturerRequestDto);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @GetMapping("/lecturers/registration-number/{registrationNumber}")
    public ResponseEntity<LecturerResponseDto> getLecturerByRegistrationNumber(
            @PathVariable String registrationNumber) throws ResourceNotFoundException {
        LecturerResponseDto responseDto = lecturerService.getLecturerByRegistrationNumber(registrationNumber);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @GetMapping("/lecturers/{lecturerId}")
    public ResponseEntity<LecturerResponseDto> getLecturerById(
            @PathVariable Long lecturerId) throws ResourceNotFoundException {
        LecturerResponseDto responseDto = lecturerService.getLecturerById(lecturerId);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @GetMapping("/lecturers")
    public ResponseEntity<List<LecturerResponseDto>> getAllLecturers() throws ResourceNotFoundException {
        List<LecturerResponseDto> responseDtos = lecturerService.getAllLecturers();
        return ResponseEntity.status(HttpStatus.OK).body(responseDtos);
    }

    @DeleteMapping("/lecturers/{lecturerId}")
    public ResponseEntity<String> deleteLecturer(
            @PathVariable Long lecturerId) throws ResourceNotFoundException {
        lecturerService.deleteLecturer(lecturerId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Lecturer with ID " + lecturerId + " has been deleted successfully.");
    }

}
