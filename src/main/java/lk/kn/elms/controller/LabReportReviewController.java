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
}
