package lk.kn.elms.service;

import lk.kn.elms.dto.request.LabReportReviewRequestDto;
import lk.kn.elms.dto.response.LabReportReviewResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import java.util.List;

public interface LabReportReviewService {

    LabReportReviewResponseDto reviewLabReport(LabReportReviewRequestDto labReportReviewRequestDto)
            throws ResourceAlreadyExistsException, ResourceNotFoundException;

    LabReportReviewResponseDto getReviewBySubmissionId(Long submissionId)
            throws ResourceNotFoundException;

    List<LabReportReviewResponseDto> getReviewsByStudentId(Long studentId)
            throws ResourceNotFoundException;

}   
