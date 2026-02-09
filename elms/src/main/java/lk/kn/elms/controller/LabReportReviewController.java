package lk.kn.elms.controller;

import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lk.kn.elms.dto.request.LabReportReviewRequestDto;
import lk.kn.elms.dto.response.LabReportReviewResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.service.LabReportReviewService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@CrossOrigin("*")
@RequestMapping(value = "/elms/api")
public class LabReportReviewController {

    private LabReportReviewService labReportReviewService;

    @RolesAllowed({"DEMONSTRATOR","LECTURER"})
    @PostMapping(value = "/report-reviews")
    public ResponseEntity<LabReportReviewResponseDto> reviewLabReport(@Valid @RequestBody LabReportReviewRequestDto labReportReviewRequestDto)
            throws ResourceAlreadyExistsException, ResourceNotFoundException {
        LabReportReviewResponseDto responseDto = labReportReviewService.reviewLabReport(labReportReviewRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @RolesAllowed({"DEMONSTRATOR","LECTURER","STUDENT"})
    @GetMapping(value = "/report-reviews/submission/{submissionId}")
    public ResponseEntity<LabReportReviewResponseDto> getReviewBySubmissionId(@PathVariable Long submissionId)
            throws ResourceNotFoundException {
        LabReportReviewResponseDto responseDto = labReportReviewService.getReviewBySubmissionId(submissionId);
        return ResponseEntity.ok(responseDto);
    }

    @RolesAllowed({"DEMONSTRATOR","LECTURER","STUDENT"})
    @GetMapping(value = "/report-reviews/student/{studentId}")
    public ResponseEntity<List<LabReportReviewResponseDto>> getReviewsByStudentId(@PathVariable Long studentId)
            throws ResourceNotFoundException {
        List<LabReportReviewResponseDto> responseDto = labReportReviewService.getReviewsByStudentId(studentId);
        return ResponseEntity.ok(responseDto);
    }
}
