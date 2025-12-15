package lk.kn.elms.controller;

import jakarta.annotation.security.RolesAllowed;
import lk.kn.elms.dto.response.ReportSubmissionCreateResponseDto;
import lk.kn.elms.exception.FileUploadingException;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.service.ReportSubmissionService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Role;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@AllArgsConstructor
@CrossOrigin("*")
@RequestMapping(value = "elms/api")
public class ReportSubmissionController {

    private  ReportSubmissionService reportSubmissionService;

    @RolesAllowed({"STUDENT"})
    @PostMapping(value = "/submissions/student/{studentId}/session/{sessionId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReportSubmissionCreateResponseDto> createSubmission(
            @PathVariable Long studentId,
            @PathVariable Long sessionId,
            @RequestPart("file") MultipartFile file)
            throws ResourceAlreadyExistsException, ResourceNotFoundException, FileUploadingException{

        ReportSubmissionCreateResponseDto responseDto = reportSubmissionService.createSubmission(studentId, sessionId, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }
}
