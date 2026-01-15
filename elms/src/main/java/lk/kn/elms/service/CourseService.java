package lk.kn.elms.service;

import lk.kn.elms.dto.request.CourseRequestDto;
import lk.kn.elms.dto.response.CourseCreateResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;

public interface CourseService {

    CourseCreateResponseDto createCourse(CourseRequestDto courseRequestDto) throws ResourceNotFoundException, ResourceAlreadyExistsException;
}
