package lk.kn.elms.service;

import lk.kn.elms.dto.request.SessionComponentRequestDto;
import lk.kn.elms.dto.response.SessionComponentResponseDto;
import lk.kn.elms.exception.ResourceNotFoundException;

import java.util.List;

public interface SessionComponentService {

    SessionComponentResponseDto createSessionComponent(Long sessionId, SessionComponentRequestDto sessionComponentRequestDto) throws ResourceNotFoundException;

    SessionComponentResponseDto updateSessionComponent(Long sessionId, SessionComponentRequestDto sessionComponentRequestDto) throws ResourceNotFoundException;

    SessionComponentResponseDto getSessionComponentBySessionId(Long sessionId) throws ResourceNotFoundException;

    List<SessionComponentResponseDto> getAllSessionComponents() throws ResourceNotFoundException;

    void deleteSessionComponent(Long sessionId) throws ResourceNotFoundException;
}
