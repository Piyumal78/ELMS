package lk.kn.elms.service;

import lk.kn.elms.dto.request.DemonstratorRequestDto;
import lk.kn.elms.dto.response.DemonstratorResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;

import java.util.List;

public interface DemonstratorService {

    DemonstratorResponseDto createDemonstrator(DemonstratorRequestDto demonstratorRequestDto) throws ResourceAlreadyExistsException;

    DemonstratorResponseDto updateDemonstrator(Long demonstratorId, DemonstratorRequestDto demonstratorRequestDto) throws ResourceNotFoundException;

    DemonstratorResponseDto getDemonstratorByRegistrationNumber(String registrationNumber) throws ResourceNotFoundException;

    DemonstratorResponseDto getDemonstratorById(Long demonstratorId) throws ResourceNotFoundException;

    List<DemonstratorResponseDto> getAllDemonstrators() throws ResourceNotFoundException;

    void deleteDemonstrator(Long demonstratorId) throws ResourceNotFoundException;
}
