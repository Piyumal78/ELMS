package lk.kn.elms.service;

import lk.kn.elms.dto.request.CourseRequestDto;
import lk.kn.elms.dto.response.CourseCreateResponseDto;
import lk.kn.elms.dto.response.CourseResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;

import java.util.List;

public interface CourseService {

    CourseCreateResponseDto createCourse(CourseRequestDto courseRequestDto) throws ResourceNotFoundException, ResourceAlreadyExistsException;
    
    List<CourseResponseDto> getAllCourses();
    
    CourseResponseDto getCourseById(Long courseId) throws ResourceNotFoundException;
    
    CourseResponseDto getCourseByCourseCode(String courseCode) throws ResourceNotFoundException;
    
}
