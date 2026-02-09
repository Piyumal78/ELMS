package lk.kn.elms.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lk.kn.elms.dto.request.SessionRequestDto;
import lk.kn.elms.dto.response.SessionCreateResponseDto;
import lk.kn.elms.exception.FileUploadingException;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.service.SessionService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@AllArgsConstructor
@CrossOrigin("*")
@RequestMapping(value = "elms/api")
public class SessionController {

    private SessionService sessionService;
    private ObjectMapper objectMapper;

    //*********************************************
    //Need to validate

//    @PostMapping(value = "/sessions", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public ResponseEntity<SessionCreateResponseDto> createSession(
//            @RequestPart("session") String sessionJson,
//            @RequestPart("file") MultipartFile file) throws FileUploadingException, ResourceAlreadyExistsException, ResourceNotFoundException, JsonProcessingException {
//
//        SessionRequestDto sessionRequestDto = objectMapper.readValue(sessionJson,SessionRequestDto.class);
//        SessionCreateResponseDto responseDto = sessionService.createSession(sessionRequestDto,file);
//        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
//    }

    @RolesAllowed({"DEMONSTRATOR","LECTURER"})
    @PostMapping(value = "/sessions")
    public ResponseEntity<SessionCreateResponseDto> createSession(
            @Valid @RequestBody SessionRequestDto sessionRequestDto) throws ResourceAlreadyExistsException,ResourceNotFoundException{
        SessionCreateResponseDto sessionCreateResponseDto = sessionService.createSession(sessionRequestDto);
        return new ResponseEntity<>(sessionCreateResponseDto, HttpStatus.CREATED);
    }

    @RolesAllowed({"STUDENT","DEMONSTRATOR","LECTURER"})
    @GetMapping("/sessions/{courseCode}")
    public ResponseEntity<java.util.List<SessionCreateResponseDto>> getSessionsByCourseCode(
            @PathVariable String courseCode) throws ResourceNotFoundException {
        java.util.List<SessionCreateResponseDto> responseDtos = sessionService.getSessionsByCourseCode(courseCode);
        return ResponseEntity.status(HttpStatus.OK).body(responseDtos);
    }

}
