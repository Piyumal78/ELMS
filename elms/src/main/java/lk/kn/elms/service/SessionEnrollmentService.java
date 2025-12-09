package lk.kn.elms.service;

import lk.kn.elms.dto.response.SessionEnrollmentResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;

public interface SessionEnrollmentService {

    SessionEnrollmentResponseDto enrollToSession(Long studentId, Long sessionId) throws ResourceNotFoundException, ResourceAlreadyExistsException;

}
