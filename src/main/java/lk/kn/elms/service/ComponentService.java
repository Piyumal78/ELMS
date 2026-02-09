package lk.kn.elms.service;

import lk.kn.elms.dto.request.ComponentRequestDto;
import lk.kn.elms.dto.response.ComponentResponseDto;
import lk.kn.elms.exception.ResourceInsufficientException;
import lk.kn.elms.exception.ResourceNotFoundException;

import java.util.List;

public interface ComponentService {

    ComponentResponseDto addComponent(ComponentRequestDto componentRequestDto);

    ComponentResponseDto deductComponent(ComponentRequestDto componentRequestDto) throws ResourceNotFoundException, ResourceInsufficientException;

    ComponentResponseDto updateComponent(ComponentRequestDto componentRequestDto) throws ResourceNotFoundException;

    List<ComponentResponseDto> getAllComponents() throws ResourceNotFoundException;

    List<ComponentResponseDto> getComponentByName(String componentName) throws ResourceNotFoundException;

    ComponentResponseDto getComponentByNameAndType(String componentName, String type) throws ResourceNotFoundException;

    ComponentResponseDto getComponentById(Long id) throws ResourceNotFoundException;

    void deleteComponent(Long id) throws ResourceNotFoundException;
}
