package lk.kn.elms.service;

import lk.kn.elms.dto.response.ReportSubmissionCreateResponseDto;
import lk.kn.elms.exception.FileUploadingException;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.web.multipart.MultipartFile;

public interface ReportSubmissionService {

    ReportSubmissionCreateResponseDto createSubmission(Long studentId, Long sessionId, MultipartFile file)
            throws ResourceAlreadyExistsException, ResourceNotFoundException, FileUploadingException;

    java.util.List<lk.kn.elms.dto.response.ReportSubmissionResponseDto> getSubmissionsBySessionId(Long sessionId);
}
