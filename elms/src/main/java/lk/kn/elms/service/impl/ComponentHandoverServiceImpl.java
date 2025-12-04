package lk.kn.elms.service.impl;

import lk.kn.elms.dto.request.ComponentHandoverRequestDto;
import lk.kn.elms.dto.response.ComponentHandoverResponseDto;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.model.ComponentHandover;
import lk.kn.elms.model.SessionComponent;
import lk.kn.elms.model.Student;
import lk.kn.elms.model.enums.ReturnStatus;
import lk.kn.elms.repository.ComponentHandoverRepository;
import lk.kn.elms.repository.SessionComponentRepository;
import lk.kn.elms.repository.StudentRepository;
import lk.kn.elms.service.ComponentHandoverService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class ComponentHandoverServiceImpl implements ComponentHandoverService {

    private ComponentHandoverRepository componentHandoverRepository;
    private StudentRepository studentRepository;
    private SessionComponentRepository sessionComponentRepository;

    @Override
    public ComponentHandoverResponseDto setHandoverComponent(ComponentHandoverRequestDto componentHandoverRequestDto) throws ResourceNotFoundException {

        Student student = studentRepository.findById(componentHandoverRequestDto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + componentHandoverRequestDto.getStudentId()));
        SessionComponent sessionComponent = sessionComponentRepository.findById(componentHandoverRequestDto.getSessionComponentId())
                .orElseThrow(() -> new ResourceNotFoundException("Session Component not found with ID: " + componentHandoverRequestDto.getSessionComponentId()));

        ComponentHandover componentHandover = new ComponentHandover();
        componentHandover.setStudent(student);
        componentHandover.setSessionComponent(sessionComponent);
        componentHandover.setReturnStatus(ReturnStatus.valueOf("PENDING"));

        componentHandoverRepository.save(componentHandover);

        return mapEntityToResponseDto(componentHandover);
    }

    @Override
    public ComponentHandoverResponseDto returnHandoverComponent(Long handoverId) throws ResourceNotFoundException {

        ComponentHandover componentHandover = componentHandoverRepository.findById(handoverId)
                .orElseThrow(() -> new ResourceNotFoundException("Component Handover not found with ID: " + handoverId));

        componentHandover.setReturnStatus(ReturnStatus.valueOf("RETURNED"));
        componentHandoverRepository.save(componentHandover);

        return mapEntityToResponseDto(componentHandover);
    }

    @Override
    public ComponentHandoverResponseDto getHandoverComponentById(Long handoverId) throws ResourceNotFoundException {

        ComponentHandover componentHandover = componentHandoverRepository.findById(handoverId)
                .orElseThrow(() -> new ResourceNotFoundException("Component Handover not found with ID: " + handoverId));

        return mapEntityToResponseDto(componentHandover);
    }

    @Override
    public List<ComponentHandoverResponseDto> getAllHandoversBySessionComponentId(Long sessionComponentId) throws ResourceNotFoundException {

        List<ComponentHandover> componentHandovers = componentHandoverRepository.findAllBySessionComponentId(sessionComponentId);

        if (componentHandovers.isEmpty()) {
            throw new ResourceNotFoundException("No Component Handovers found for Session Component ID: " + sessionComponentId);
        }
        return mapEntityListToResponseDtoList(componentHandovers);
    }

    @Override
    public void deleteHandoverComponent(Long handoverId) throws ResourceNotFoundException {
        ComponentHandover componentHandover = componentHandoverRepository.findById(handoverId)
                .orElseThrow(() -> new ResourceNotFoundException("Component Handover not found with ID: " + handoverId));

        componentHandoverRepository.delete(componentHandover);

    }

    private ComponentHandoverResponseDto mapEntityToResponseDto(ComponentHandover componentHandover) {

        ComponentHandoverResponseDto dto = new ComponentHandoverResponseDto();
        dto.setId(componentHandover.getId());
        dto.setSessionComponentId(componentHandover.getSessionComponent().getId());
        dto.setRegistrationNumber(componentHandover.getStudent().getRegistrationNumber());
        dto.setReturnStatus(componentHandover.getReturnStatus().name());
        dto.setHandedOverDate(componentHandover.getCreatedAt());
        return dto;
    }

    private List<ComponentHandoverResponseDto> mapEntityListToResponseDtoList(List<ComponentHandover> componentHandovers) {

        List<ComponentHandoverResponseDto> dtoList = new ArrayList<>();
        for (ComponentHandover componentHandover : componentHandovers) {
            ComponentHandoverResponseDto dto = mapEntityToResponseDto(componentHandover);
            dtoList.add(dto);
        }
        return dtoList;
    }
}
