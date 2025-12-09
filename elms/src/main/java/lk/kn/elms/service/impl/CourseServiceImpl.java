package lk.kn.elms.service.impl;

import lk.kn.elms.dto.request.CourseRequestDto;
import lk.kn.elms.dto.response.CourseCreateResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.model.Course;
import lk.kn.elms.model.Lecturer;
import lk.kn.elms.repository.CourseRepository;
import lk.kn.elms.repository.LecturerRepository;
import lk.kn.elms.service.CourseService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

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
}
