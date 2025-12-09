package lk.kn.elms.service.impl;

import lk.kn.elms.dto.request.LabReportReviewRequestDto;
import lk.kn.elms.dto.response.LabReportReviewResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.model.Demonstrator;
import lk.kn.elms.model.LabReportReview;
import lk.kn.elms.model.ReportSubmission;
import lk.kn.elms.model.enums.Grade;
import lk.kn.elms.repository.DemonstratorRepository;
import lk.kn.elms.repository.LabReportReviewRepository;
import lk.kn.elms.repository.ReportSubmissionRepository;
import lk.kn.elms.service.LabReportReviewService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class LabReportReviewServiceImpl implements LabReportReviewService {

    private LabReportReviewRepository labReportReviewRepository;
    private DemonstratorRepository demonstratorRepository;
    private ReportSubmissionRepository reportSubmissionRepository;

    @Override
    public LabReportReviewResponseDto reviewLabReport(LabReportReviewRequestDto labReportReviewRequestDto)
            throws ResourceAlreadyExistsException, ResourceNotFoundException {

        if (labReportReviewRepository.existsByReportSubmissionId(labReportReviewRequestDto.getReportSubmissionId())) {
            throw new ResourceAlreadyExistsException("Report review already exists");
        }

        Demonstrator demonstrator = demonstratorRepository.findById(labReportReviewRequestDto.getDemonstratorId())
                .orElseThrow(() -> new ResourceNotFoundException("Demonstrator not found for id: " + labReportReviewRequestDto.getDemonstratorId()));

        ReportSubmission reportSubmission = reportSubmissionRepository.findById(labReportReviewRequestDto.getReportSubmissionId())
                .orElseThrow(()-> new ResourceNotFoundException("ReportSubmission not found for id: " + labReportReviewRequestDto.getReportSubmissionId()));

        LabReportReview labReportReview = new LabReportReview();
        labReportReview.setComments(labReportReviewRequestDto.getComments());
        labReportReview.setGrade(Grade.valueOf(labReportReviewRequestDto.getGrade()));
        labReportReview.setDemonstrator(demonstrator);
        labReportReview.setReportSubmission(reportSubmission);
        labReportReviewRepository.save(labReportReview);

        return mapEntityToResponseDto(labReportReview);
    }



    private LabReportReviewResponseDto mapEntityToResponseDto(LabReportReview labReportReview) {

        LabReportReviewResponseDto labReportReviewResponseDto = new LabReportReviewResponseDto();
        labReportReviewResponseDto.setLabReportReviewId(labReportReview.getId());
        labReportReviewResponseDto.setComment(labReportReview.getComments());
        labReportReviewResponseDto.setGrade(labReportReview.getGrade().toString());
        labReportReviewResponseDto.setDemonstratorId(labReportReview.getDemonstrator().getId());
        labReportReviewResponseDto.setDemonstratorName(labReportReview.getDemonstrator().getName());
        labReportReviewResponseDto.setReportSubmissionId(labReportReview.getReportSubmission().getId());
        labReportReviewResponseDto.setReviewedAt(labReportReview.getReviewedAt());
        return labReportReviewResponseDto;
    }
}
