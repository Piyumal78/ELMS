package lk.kn.elms.service.impl;

import lk.kn.elms.dto.request.LecturerRequestDto;
import lk.kn.elms.dto.response.LecturerResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.model.Lecturer;
import lk.kn.elms.model.enums.UserRole;
import lk.kn.elms.repository.LecturerRepository;
import lk.kn.elms.service.LecturerService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class LecturerServiceImpl implements LecturerService {

    private LecturerRepository lecturerRepository;

    @Override
    public LecturerResponseDto createLecturer(LecturerRequestDto lecturerRequestDto) throws ResourceAlreadyExistsException {

        if(lecturerRepository.existsByRegistrationNumber(lecturerRequestDto.getRegistrationNumber())) {
            throw new ResourceAlreadyExistsException("Lecturer with registration number " +
                    lecturerRequestDto.getRegistrationNumber() + " already exists.");
        }
        if(lecturerRepository.existsByEmail(lecturerRequestDto.getEmail())) {
            throw new ResourceAlreadyExistsException("Lecturer with email " +
                    lecturerRequestDto.getEmail() + " already exists.");
        }

        Lecturer lecturer = new Lecturer();
        lecturer.setRegistrationNumber(lecturerRequestDto.getRegistrationNumber());
        lecturer.setName(lecturerRequestDto.getName());
        lecturer.setEmail(lecturerRequestDto.getEmail());
        lecturer.setRole(UserRole.ROLE_LECTURER);
        lecturerRepository.save(lecturer);

        return mapEntityToResponseDto(lecturer);
    }

    @Override
    public LecturerResponseDto updateLecturer(Long lecturerId, LecturerRequestDto lecturerRequestDto) throws ResourceNotFoundException {

        Lecturer lecturer = lecturerRepository.findById(lecturerId)
                .orElseThrow(() -> new ResourceNotFoundException("Lecturer with ID " + lecturerId + " not found."));

        lecturer.setRegistrationNumber(lecturerRequestDto.getRegistrationNumber());
        lecturer.setName(lecturerRequestDto.getName());
        lecturer.setEmail(lecturerRequestDto.getEmail());
        lecturerRepository.save(lecturer);

        return mapEntityToResponseDto(lecturer);
    }

    @Override
    public LecturerResponseDto getLecturerByRegistrationNumber(String registrationNumber) throws ResourceNotFoundException {

        Lecturer lecturer = lecturerRepository.findByRegistrationNumber(registrationNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Lecturer with registration number " +
                        registrationNumber + " not found."));

        return mapEntityToResponseDto(lecturer);
    }

    @Override
    public LecturerResponseDto getLecturerById(Long lecturerId) throws ResourceNotFoundException {

        Lecturer lecturer = lecturerRepository.findById(lecturerId)
                .orElseThrow(() -> new ResourceNotFoundException("Lecturer with ID " + lecturerId + " not found."));

        return mapEntityToResponseDto(lecturer);
    }

    @Override
    public List<LecturerResponseDto> getAllLecturers() throws ResourceNotFoundException {

        List<Lecturer> lecturers = lecturerRepository.findAll();
        if (lecturers.isEmpty()) {
            throw new ResourceNotFoundException("No lecturers found.");
        }

        return mapEntityListToResponseDtoList(lecturers);
    }

    @Override
    public void deleteLecturer(Long lecturer) throws ResourceNotFoundException {

        Lecturer existingLecturer = lecturerRepository.findById(lecturer)
                .orElseThrow(() -> new ResourceNotFoundException("Lecturer with ID " + lecturer + " not found."));
        lecturerRepository.delete(existingLecturer);

    }

    private LecturerResponseDto mapEntityToResponseDto(Lecturer lecturer) {
        LecturerResponseDto lecturerResponseDto = new LecturerResponseDto();
        lecturerResponseDto.setDemonstratorId(lecturer.getId());
        lecturerResponseDto.setRegistrationNumber(lecturer.getRegistrationNumber());
        lecturerResponseDto.setName(lecturer.getName());
        lecturerResponseDto.setEmail(lecturer.getEmail());
        lecturerResponseDto.setCreatedDate(lecturer.getCreatedAt());
        lecturerResponseDto.setUpdatedDate(lecturer.getUpdatedAt());
        return lecturerResponseDto;
    }

    private List<LecturerResponseDto> mapEntityListToResponseDtoList(List<Lecturer> lecturers){

        List<LecturerResponseDto> responseDtoList = new ArrayList<>();
        for (Lecturer lecturer : lecturers) {
            LecturerResponseDto responseDto = mapEntityToResponseDto(lecturer);
            responseDtoList.add(responseDto);
    }
        return responseDtoList;
    }
}
