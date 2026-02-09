package lk.kn.elms.service;

import lk.kn.elms.dto.request.StudentRequestDto;
import lk.kn.elms.dto.request.StudentUpdateRequestDto;
import lk.kn.elms.dto.response.*;
import lk.kn.elms.exception.FileUploadingException;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import org.springframework.web.multipart.MultipartFile;

public interface StudentService {

    StudentCreateResponseDto createStudent(StudentRequestDto studentRequestDto) throws ResourceAlreadyExistsException;

    StudentDetailUpdateResponseDto updateStudent(Long id, StudentUpdateRequestDto studentUpdateRequestDto) throws ResourceNotFoundException;

    StudentResponseDto getStudent(Long id) throws ResourceNotFoundException;

    StudentPhotoResponseDto uploadProfilePhoto(Long studentId, MultipartFile file)
            throws ResourceAlreadyExistsException, ResourceNotFoundException, FileUploadingException;

    void deleteProfilePhoto(Long studentId) throws ResourceNotFoundException;

    String getImageUrl(Long studentId) throws ResourceNotFoundException;

}
