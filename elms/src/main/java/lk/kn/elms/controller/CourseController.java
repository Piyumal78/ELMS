package lk.kn.elms.controller;

import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lk.kn.elms.dto.request.CourseRequestDto;
import lk.kn.elms.dto.response.CourseCreateResponseDto;
import lk.kn.elms.dto.response.CourseResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.service.CourseService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@CrossOrigin("*")
@RequestMapping(value = "/elms/api")
public class CourseController {

    private CourseService courseService;

    @RolesAllowed({"LECTURER"})
    @PostMapping("/courses")
    public ResponseEntity<CourseCreateResponseDto> createCourse(
            @Valid @RequestBody CourseRequestDto courseRequestDto) throws ResourceAlreadyExistsException, ResourceNotFoundException{
        CourseCreateResponseDto responseDto = courseService.createCourse(courseRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    
    @GetMapping("/courses/all")
    public ResponseEntity<List<CourseResponseDto>> getAllCourses() {
        List<CourseResponseDto> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    @RolesAllowed({"STUDENT","DEMONSTRATOR","LECTURER"})
    @GetMapping("/courses/{courseId}")
    public ResponseEntity<CourseResponseDto> getCourseById(@PathVariable Long courseId) throws ResourceNotFoundException {
        CourseResponseDto responseDto = courseService.getCourseById(courseId);
        return ResponseEntity.ok(responseDto);
    }

    @RolesAllowed({"STUDENT","DEMONSTRATOR","LECTURER"})
    @GetMapping("/courses/code/{courseCode}")
    public ResponseEntity<CourseResponseDto> getCourseByCourseCode(@PathVariable String courseCode) throws ResourceNotFoundException {
        CourseResponseDto responseDto = courseService.getCourseByCourseCode(courseCode);
        return ResponseEntity.ok(responseDto);
    }

}
