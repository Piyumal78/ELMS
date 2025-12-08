package lk.kn.elms.service;

import lk.kn.elms.dto.request.LecturerRequestDto;
import lk.kn.elms.dto.response.LecturerResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;

import java.util.List;

public interface LecturerService {

    LecturerResponseDto createLecturer(LecturerRequestDto lecturerRequestDto) throws ResourceAlreadyExistsException;

    LecturerResponseDto updateLecturer(Long lecturerId, LecturerRequestDto lecturerRequestDto) throws ResourceNotFoundException;

    LecturerResponseDto getLecturerByRegistrationNumber(String registrationNumber) throws ResourceNotFoundException;

    LecturerResponseDto getLecturerById(Long lecturerId) throws ResourceNotFoundException;

    List<LecturerResponseDto> getAllLecturers() throws ResourceNotFoundException;

    void deleteLecturer(Long lecturer) throws ResourceNotFoundException;
}
