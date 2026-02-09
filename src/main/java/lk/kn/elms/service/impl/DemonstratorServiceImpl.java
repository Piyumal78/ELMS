package lk.kn.elms.service.impl;

import lk.kn.elms.dto.request.DemonstratorRequestDto;
import lk.kn.elms.dto.response.DemonstratorResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.model.Demonstrator;
import lk.kn.elms.model.enums.UserRole;
import lk.kn.elms.repository.DemonstratorRepository;
import lk.kn.elms.service.DemonstratorService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class DemonstratorServiceImpl implements DemonstratorService {

    private DemonstratorRepository demonstratorRepository;

    @Override
    public DemonstratorResponseDto createDemonstrator(DemonstratorRequestDto demonstratorRequestDto) throws ResourceAlreadyExistsException {

        if (demonstratorRepository.existsByRegistrationNumber(demonstratorRequestDto.getRegistrationNumber())) {
            throw new ResourceAlreadyExistsException("Demonstrator with registration number " +
                    demonstratorRequestDto.getRegistrationNumber() + " already exists.");
        }
        if(demonstratorRepository.existsByEmail(demonstratorRequestDto.getEmail())){
            throw new ResourceAlreadyExistsException("Demonstrator with email " +
                    demonstratorRequestDto.getEmail() + " already exists.");
        }

        Demonstrator demonstrator = new Demonstrator();
        demonstrator.setRegistrationNumber(demonstratorRequestDto.getRegistrationNumber());
        demonstrator.setName(demonstratorRequestDto.getName());
        demonstrator.setEmail(demonstratorRequestDto.getEmail());
        demonstrator.setRole(UserRole.ROLE_DEMONSTRATOR);
        demonstratorRepository.save(demonstrator);

        return mapEntityToResponseDto(demonstrator);
    }

    @Override
    public DemonstratorResponseDto updateDemonstrator(Long demonstratorId, DemonstratorRequestDto demonstratorRequestDto) throws ResourceNotFoundException {

        Demonstrator demonstrator = demonstratorRepository.findById(demonstratorId)
                .orElseThrow(() -> new ResourceNotFoundException("Demonstrator with ID " + demonstratorId + " not found."));

        demonstrator.setRegistrationNumber(demonstratorRequestDto.getRegistrationNumber());
        demonstrator.setName(demonstratorRequestDto.getName());
        demonstrator.setEmail(demonstratorRequestDto.getEmail());
        demonstratorRepository.save(demonstrator);

        return mapEntityToResponseDto(demonstrator);
    }

    @Override
    public DemonstratorResponseDto getDemonstratorByRegistrationNumber(String registrationNumber) throws ResourceNotFoundException {

        Demonstrator demonstrator = demonstratorRepository.findByRegistrationNumber(registrationNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Demonstrator with registration number " +
                        registrationNumber + " not found."));

        return mapEntityToResponseDto(demonstrator);
    }

    @Override
    public DemonstratorResponseDto getDemonstratorById(Long demonstratorId) throws ResourceNotFoundException {

        Demonstrator demonstrator = demonstratorRepository.findById(demonstratorId)
                .orElseThrow(() -> new ResourceNotFoundException("Demonstrator with ID " + demonstratorId + " not found."));

        return mapEntityToResponseDto(demonstrator);
    }

    @Override
    public List<DemonstratorResponseDto> getAllDemonstrators() throws ResourceNotFoundException {

        List<Demonstrator> demonstrators = demonstratorRepository.findAll();
        if (demonstrators.isEmpty()) {
            throw new ResourceNotFoundException("No demonstrators found.");
        }

        return mapEntityListToResponseDtoList(demonstrators);
    }

    @Override
    public void deleteDemonstrator(Long demonstratorId) throws ResourceNotFoundException {

        Demonstrator demonstrator = demonstratorRepository.findById(demonstratorId)
                .orElseThrow(() -> new ResourceNotFoundException("Demonstrator with ID " + demonstratorId + " not found."));

        demonstratorRepository.delete(demonstrator);
    }

    private DemonstratorResponseDto mapEntityToResponseDto(Demonstrator demonstrator){
        DemonstratorResponseDto responseDto = new DemonstratorResponseDto();
        responseDto.setDemonstratorId(demonstrator.getId());
        responseDto.setRegistrationNumber(demonstrator.getRegistrationNumber());
        responseDto.setName(demonstrator.getName());
        responseDto.setEmail(demonstrator.getEmail());
        responseDto.setCreatedDate(demonstrator.getCreatedAt());
        responseDto.setUpdatedDate(demonstrator.getUpdatedAt());
        return responseDto;
    }

    private List<DemonstratorResponseDto> mapEntityListToResponseDtoList(List<Demonstrator> demonstrators){

        List<DemonstratorResponseDto> responseDtoList = new ArrayList<>();
        for (Demonstrator demonstrator : demonstrators) {
            DemonstratorResponseDto responseDto = mapEntityToResponseDto(demonstrator);
            responseDtoList.add(responseDto);
    }
        return responseDtoList;
    }
}
