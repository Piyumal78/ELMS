package lk.kn.elms.service.impl;

import lk.kn.elms.dto.response.CourseEnrollmentListResponseDto;
import lk.kn.elms.dto.response.CourseEnrollmentResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.model.Course;
import lk.kn.elms.model.CourseEnrollment;
import lk.kn.elms.model.Student;
import lk.kn.elms.repository.CourseEnrollmentRepository;
import lk.kn.elms.repository.CourseRepository;
import lk.kn.elms.repository.StudentRepository;
import lk.kn.elms.service.CourseEnrollmentService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class CourseEnrollmentServiceImpl implements CourseEnrollmentService {

    private CourseEnrollmentRepository courseEnrollmentRepository;
    private StudentRepository studentRepository;
    private CourseRepository courseRepository;

    @Override
    public CourseEnrollmentResponseDto enrollInCourse(Long courseId) throws ResourceNotFoundException,ResourceAlreadyExistsException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String registrationNumber = authentication.getName();

        Student student = studentRepository.findByRegistrationNumber(registrationNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with : " + registrationNumber));

        if (courseEnrollmentRepository.existsByStudentIdAndCourseId(student.getId(), courseId)) {
            throw new ResourceAlreadyExistsException("Already enrolled");
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + courseId));

        CourseEnrollment courseEnrollment = new CourseEnrollment();
        courseEnrollment.setStudent(student);
        courseEnrollment.setCourse(course);
        courseEnrollmentRepository.save(courseEnrollment);

        return mapEntityToResponseDto(courseEnrollment);
    }

    @Override
    public void unEnrollFromCourse(Long enrollmentId) throws ResourceNotFoundException {

        CourseEnrollment courseEnrollment = courseEnrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Course Enrollment not found with ID: " + enrollmentId));

        courseEnrollmentRepository.delete(courseEnrollment);
    }

    @Override
    public CourseEnrollmentResponseDto getEnrollmentByEnrollmentId(Long enrollmentId) throws ResourceNotFoundException {

        CourseEnrollment courseEnrollment = courseEnrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Course Enrollment not found with ID: " + enrollmentId));

        return mapEntityToResponseDto(courseEnrollment);
    }

    @Override
    public CourseEnrollmentListResponseDto getAllEnrollmentsByStudentId(Long studentId) throws ResourceNotFoundException {

        List<CourseEnrollment> enrollments = courseEnrollmentRepository.findByStudentId(studentId);

        if (enrollments.isEmpty()) {
            throw new ResourceNotFoundException("No enrollments found for Student ID: " + studentId);
        }

        return mapEntityListToResponseDtoList(enrollments);
    }

    @Override
    public CourseEnrollmentListResponseDto getAllEnrollmentsByCourseId(Long courseId) throws ResourceNotFoundException {

        List<CourseEnrollment> enrollments = courseEnrollmentRepository.findByCourseId(courseId);

        if (enrollments.isEmpty()) {
            throw new ResourceNotFoundException("No enrollments found for Course ID: " + courseId);
        }

        return mapEntityListToResponseDtoList(enrollments);
    }

    private CourseEnrollmentResponseDto mapEntityToResponseDto(CourseEnrollment courseEnrollment) {

        CourseEnrollmentResponseDto responseDto = new CourseEnrollmentResponseDto();
        responseDto.setEnrollmentId(courseEnrollment.getId());
        responseDto.setCourseId(courseEnrollment.getCourse().getId());
        responseDto.setCourseName(courseEnrollment.getCourse().getCourseName());
        responseDto.setCourseCode(courseEnrollment.getCourse().getCourseCode());
        responseDto.setStudentId(courseEnrollment.getStudent().getId());
        responseDto.setStudentName(courseEnrollment.getStudent().getName());
        responseDto.setStudentNumber(courseEnrollment.getStudent().getRegistrationNumber());
        responseDto.setEnrollmentDate(courseEnrollment.getCreatedAt());
        return responseDto;
    }

    private CourseEnrollmentListResponseDto mapEntityListToResponseDtoList(List<CourseEnrollment> enrollments) {

        List<CourseEnrollmentResponseDto> responseDtoList = new ArrayList<>();
        for (CourseEnrollment enrollment : enrollments) {
            CourseEnrollmentResponseDto responseDto = mapEntityToResponseDto(enrollment);
            responseDtoList.add(responseDto);
        }
        CourseEnrollmentListResponseDto listResponseDto = new CourseEnrollmentListResponseDto();
        listResponseDto.setEnrollmentResponseDtoList(responseDtoList);
        listResponseDto.setTotalEnrollments(responseDtoList.size());
        return listResponseDto;
    }
}
