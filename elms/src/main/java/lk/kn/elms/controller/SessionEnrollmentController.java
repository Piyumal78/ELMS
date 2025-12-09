package lk.kn.elms.controller;

import lk.kn.elms.dto.response.SessionEnrollmentResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.service.SessionEnrollmentService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@CrossOrigin("*")
@RequestMapping(value = "elms/api")
public class SessionEnrollmentController {

    private SessionEnrollmentService sessionEnrollmentService;

    @PostMapping(value = "session-enrollments/student/{studentId}/session/{sessionId}")
    public ResponseEntity<SessionEnrollmentResponseDto> enrollToSession(
            @PathVariable Long studentId,
            @PathVariable Long sessionId) throws ResourceAlreadyExistsException, ResourceNotFoundException{
        SessionEnrollmentResponseDto responseDto = sessionEnrollmentService.enrollToSession(studentId,sessionId);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }
}
