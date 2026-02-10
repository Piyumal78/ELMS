package lk.kn.elms.controller;

import jakarta.annotation.security.RolesAllowed;
import lk.kn.elms.dto.response.LabManualCreateResponseDto;
import lk.kn.elms.exception.FileUploadingException;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.service.LabManualService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@AllArgsConstructor
@CrossOrigin("*")
@RequestMapping(value = "/elms/api")
public class LabManualController {

    private LabManualService labManualService;

   @RolesAllowed({"DEMONSTRATOR","LECTURER","STUDENT"})
    @PostMapping(value = "/lab-manuals/session/{sessionId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<LabManualCreateResponseDto> uploadLabManual(
            @PathVariable Long sessionId,
            @RequestPart("file") MultipartFile file
    ) throws ResourceAlreadyExistsException, ResourceNotFoundException, FileUploadingException {

        LabManualCreateResponseDto response =
                labManualService.uploadLabManual(sessionId, file);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @RolesAllowed({"STUDENT","DEMONSTRATOR","LECTURER"})
    @GetMapping("/lab-manuals/session/{sessionId}")
    public ResponseEntity<LabManualCreateResponseDto> getLabManualBySessionId(
            @PathVariable Long sessionId) throws ResourceNotFoundException {

        LabManualCreateResponseDto responseDto = labManualService.getLabManualBySessionId(sessionId);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }
}
