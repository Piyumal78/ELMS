package lk.kn.elms.service;

import lk.kn.elms.dto.request.StudentRequestDto;
import lk.kn.elms.dto.response.StudentCreateResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;

public interface StudentService {

    StudentCreateResponseDto createStudent(StudentRequestDto studentRequestDto) throws ResourceAlreadyExistsException;

}
