package lk.kn.elms.controller;

import jakarta.validation.Valid;
import lk.kn.elms.dto.request.SessionComponentRequestDto;
import lk.kn.elms.dto.response.SessionComponentResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceInsufficientException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.service.SessionComponentService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@CrossOrigin("*")
@RequestMapping(value = "/elms/api")
public class SessionComponentController {

    private SessionComponentService sessionComponentService;

    @PostMapping(value = "/sessions/{sessionId}/session-components")
    public ResponseEntity<SessionComponentResponseDto> createSessionComponent(
            @PathVariable Long sessionId,
            @RequestBody @Valid SessionComponentRequestDto sessionComponentRequestDto)
            throws ResourceNotFoundException, ResourceInsufficientException, ResourceAlreadyExistsException {

        SessionComponentResponseDto responseDto = sessionComponentService.createSessionComponent(sessionId, sessionComponentRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @PutMapping(value = "/sessions/{sessionId}/session-components")
    public ResponseEntity<SessionComponentResponseDto> updateSessionComponent(
            @PathVariable Long sessionId,
            @RequestBody @Valid SessionComponentRequestDto sessionComponentRequestDto) throws ResourceNotFoundException{

        SessionComponentResponseDto responseDto = sessionComponentService.updateSessionComponent(sessionId, sessionComponentRequestDto);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @GetMapping(value = "/sessions/{sessionId}/session-components")
    public ResponseEntity<SessionComponentResponseDto> getSessionComponentBySessionId(
            @PathVariable Long sessionId) throws ResourceNotFoundException{
        SessionComponentResponseDto responseDto = sessionComponentService.getSessionComponentBySessionId(sessionId);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @GetMapping(value = "/session-components")
    public ResponseEntity<List<SessionComponentResponseDto>> getAllSessionComponents() throws ResourceNotFoundException{

        List<SessionComponentResponseDto> responseDtoList = sessionComponentService.getAllSessionComponents();
        return ResponseEntity.status(HttpStatus.OK).body(responseDtoList);
    }

    @DeleteMapping(value = "/sessions/{sessionId}/session-components")
    public ResponseEntity<String> deleteSessionComponent(@PathVariable Long sessionId) throws ResourceNotFoundException {

        sessionComponentService.deleteSessionComponent(sessionId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("SessionComponent deleted successfully for session id: " + sessionId);
    }
}
