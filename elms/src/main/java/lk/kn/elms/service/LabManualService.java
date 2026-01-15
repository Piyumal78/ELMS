package lk.kn.elms.service;

import lk.kn.elms.dto.response.LabManualCreateResponseDto;
import lk.kn.elms.exception.FileUploadingException;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import org.springframework.web.multipart.MultipartFile;

public interface LabManualService {

    LabManualCreateResponseDto uploadLabManual(Long sessionId, MultipartFile file)
            throws ResourceAlreadyExistsException, ResourceNotFoundException, FileUploadingException;
}
