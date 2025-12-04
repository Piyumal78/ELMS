package lk.kn.elms.service;

import lk.kn.elms.dto.request.ComponentHandoverRequestDto;
import lk.kn.elms.dto.response.ComponentHandoverResponseDto;
import lk.kn.elms.exception.ResourceNotFoundException;

import java.util.List;

public interface ComponentHandoverService {

    ComponentHandoverResponseDto setHandoverComponent(ComponentHandoverRequestDto componentHandoverRequestDto) throws ResourceNotFoundException;

    ComponentHandoverResponseDto returnHandoverComponent(Long handoverId) throws ResourceNotFoundException;

    ComponentHandoverResponseDto getHandoverComponentById(Long handoverId) throws ResourceNotFoundException;

    List<ComponentHandoverResponseDto> getAllHandoversBySessionComponentId(Long sessionComponentId) throws ResourceNotFoundException;

    void deleteHandoverComponent(Long handoverId) throws ResourceNotFoundException;
}
