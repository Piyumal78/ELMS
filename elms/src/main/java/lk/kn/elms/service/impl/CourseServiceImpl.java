package lk.kn.elms.service.impl;

import lk.kn.elms.dto.request.CourseRequestDto;
import lk.kn.elms.dto.response.CourseCreateResponseDto;
import lk.kn.elms.dto.response.CourseResponseDto;
import lk.kn.elms.dto.response.LecturerResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.model.Course;
import lk.kn.elms.model.Lecturer;
import lk.kn.elms.repository.CourseRepository;
import lk.kn.elms.repository.LecturerRepository;
import lk.kn.elms.service.CourseService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CourseServiceImpl implements CourseService {

    private CourseRepository courseRepository;
    private LecturerRepository lecturerRepository;

    @Override
    public CourseCreateResponseDto createCourse(CourseRequestDto courseRequestDto) throws ResourceNotFoundException, ResourceAlreadyExistsException {

        if (courseRepository.existsByCourseCodeAndAcademicYear(courseRequestDto.getCourseCode(), courseRequestDto.getAcademicYear())) {
            throw new ResourceAlreadyExistsException("Course with code " + courseRequestDto.getCourseCode() + " for academic year " + courseRequestDto.getAcademicYear() + " already exists.");
        }

        Lecturer lecturer = lecturerRepository.findById(courseRequestDto.getLecturerId())
                .orElseThrow(() -> new ResourceNotFoundException("Lecturer with ID " + courseRequestDto.getLecturerId() + " not found."));

        Course course = new Course();
        course.setCourseCode(courseRequestDto.getCourseCode());
        course.setCourseName(courseRequestDto.getCourseName());
        course.setAcademicYear(courseRequestDto.getAcademicYear());
        course.setLecturer(lecturer);

        courseRepository.save(course);

        CourseCreateResponseDto responseDto = new CourseCreateResponseDto();
        responseDto.setCourseId(course.getId());
        responseDto.setCourseCode(course.getCourseCode());
        responseDto.setCourseName(course.getCourseName());
        responseDto.setAcademicYear(course.getAcademicYear());
        responseDto.setLecturerId(course.getLecturer().getId());
        responseDto.setLecturerName(course.getLecturer().getName());

        return responseDto;
    }

    @Override
    public List<CourseResponseDto> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        
        return courses.stream()
                .map(course -> {
                    CourseResponseDto dto = new CourseResponseDto();
                    dto.setCourseId(course.getId());
                    dto.setCourseCode(course.getCourseCode());
                    dto.setCourseName(course.getCourseName());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public CourseResponseDto getCourseById(Long courseId) throws ResourceNotFoundException {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course with ID " + courseId + " not found."));

        CourseResponseDto responseDto = new CourseResponseDto();
        responseDto.setCourseId(course.getId());
        responseDto.setCourseCode(course.getCourseCode());
        responseDto.setCourseName(course.getCourseName());
        
        Lecturer lecturer = course.getLecturer();
        if (lecturer != null) {
            LecturerResponseDto lecturerDto = new LecturerResponseDto();
            lecturerDto.setLectureId(lecturer.getId());
            lecturerDto.setName(lecturer.getName());
            lecturerDto.setRegistrationNumber(lecturer.getRegistrationNumber());
            lecturerDto.setEmail(lecturer.getEmail());
            lecturerDto.setCreatedDate(lecturer.getCreatedAt());
            lecturerDto.setUpdatedDate(lecturer.getUpdatedAt());
            responseDto.setLecturer(lecturerDto);
        }
        
        return responseDto;
    }

    @Override
    public CourseResponseDto getCourseByCourseCode(String courseCode) throws ResourceNotFoundException {
        Course course = courseRepository.findByCourseCode(courseCode)
                .orElseThrow(() -> new ResourceNotFoundException("Course with code " + courseCode + " not found."));

        CourseResponseDto responseDto = new CourseResponseDto();
        responseDto.setCourseId(course.getId());
        responseDto.setCourseCode(course.getCourseCode());
        responseDto.setCourseName(course.getCourseName());
        
        Lecturer lecturer = course.getLecturer();
        if (lecturer != null) {
            LecturerResponseDto lecturerDto = new LecturerResponseDto();
            lecturerDto.setLectureId(lecturer.getId());
            lecturerDto.setName(lecturer.getName());
            lecturerDto.setRegistrationNumber(lecturer.getRegistrationNumber());
            lecturerDto.setEmail(lecturer.getEmail());
            lecturerDto.setCreatedDate(lecturer.getCreatedAt());
            lecturerDto.setUpdatedDate(lecturer.getUpdatedAt());
            responseDto.setLecturer(lecturerDto);
        }
        
        return responseDto;
    }
}
