package lk.kn.elms.controller;

import jakarta.validation.Valid;
import lk.kn.elms.dto.request.CourseEnrollmentRequestDto;
import lk.kn.elms.dto.response.CourseEnrollmentListResponseDto;
import lk.kn.elms.dto.response.CourseEnrollmentResponseDto;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.service.CourseEnrollmentService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@CrossOrigin("*")
@RequestMapping(value = "/elms/api")
public class CourseEnrollmentController {

    private CourseEnrollmentService courseEnrollmentService;

    @PostMapping("/enrollments")
    public ResponseEntity<CourseEnrollmentResponseDto> enrollInCourse(
            @Valid @RequestBody CourseEnrollmentRequestDto courseEnrollmentRequestDto) throws ResourceNotFoundException {
        CourseEnrollmentResponseDto responseDto = courseEnrollmentService.enrollInCourse(courseEnrollmentRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @DeleteMapping("/enrollments/{enrollmentId}")
    public ResponseEntity<String> unEnrollFromCourse(@PathVariable Long enrollmentId) throws ResourceNotFoundException {
        courseEnrollmentService.unEnrollFromCourse(enrollmentId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Unenrolled successfully");
    }

    @GetMapping("/enrollments/{enrollmentId}")
    public ResponseEntity<CourseEnrollmentResponseDto> getEnrollmentByEnrollmentId(
            @PathVariable Long enrollmentId) throws ResourceNotFoundException {
        CourseEnrollmentResponseDto responseDto = courseEnrollmentService.getEnrollmentByEnrollmentId(enrollmentId);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @GetMapping("/enrollments/students/{studentId}")
    public ResponseEntity<CourseEnrollmentListResponseDto> getAllEnrollmentsByStudentId(
            @PathVariable Long studentId) throws ResourceNotFoundException {
        CourseEnrollmentListResponseDto responseDto = courseEnrollmentService.getAllEnrollmentsByStudentId(studentId);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @GetMapping("/enrollments/courses/{courseId}")
    public ResponseEntity<CourseEnrollmentListResponseDto> getAllEnrollmentsByCourseId(
            @PathVariable Long courseId) throws ResourceNotFoundException {
        CourseEnrollmentListResponseDto responseDto = courseEnrollmentService.getAllEnrollmentsByCourseId(courseId);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }
}