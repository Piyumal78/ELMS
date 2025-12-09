package lk.kn.elms.service;

import lk.kn.elms.dto.request.SessionRequestDto;
import lk.kn.elms.dto.response.SessionCreateResponseDto;
import lk.kn.elms.exception.FileUploadingException;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import org.springframework.web.multipart.MultipartFile;

public interface SessionService {

    SessionCreateResponseDto createSession(SessionRequestDto sessionRequestDto, MultipartFile file)
            throws FileUploadingException, ResourceAlreadyExistsException, ResourceNotFoundException;

}
