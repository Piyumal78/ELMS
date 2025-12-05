package lk.kn.elms.service;

import lk.kn.elms.dto.request.CourseEnrollmentRequestDto;
import lk.kn.elms.dto.response.CourseEnrollmentListResponseDto;
import lk.kn.elms.dto.response.CourseEnrollmentResponseDto;
import lk.kn.elms.exception.ResourceNotFoundException;

import java.util.List;

public interface CourseEnrollmentService {

    CourseEnrollmentResponseDto enrollInCourse(CourseEnrollmentRequestDto courseEnrollmentRequestDto) throws ResourceNotFoundException;

    void unEnrollFromCourse(Long enrollmentId) throws ResourceNotFoundException;

    CourseEnrollmentResponseDto getEnrollmentByEnrollmentId(Long enrollmentId) throws ResourceNotFoundException;

    CourseEnrollmentListResponseDto getAllEnrollmentsByStudentId(Long studentId) throws ResourceNotFoundException;

    CourseEnrollmentListResponseDto getAllEnrollmentsByCourseId(Long courseId) throws ResourceNotFoundException;
}
