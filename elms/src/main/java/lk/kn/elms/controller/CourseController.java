package lk.kn.elms.controller;

import jakarta.validation.Valid;
import lk.kn.elms.dto.request.CourseRequestDto;
import lk.kn.elms.dto.response.CourseCreateResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.service.CourseService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@CrossOrigin("*")
@RequestMapping(value = "/elms/api")
public class CourseController {

    private CourseService courseService;

    @PostMapping("/courses")
    public ResponseEntity<CourseCreateResponseDto> createCourse(
            @Valid @RequestBody CourseRequestDto courseRequestDto) throws ResourceAlreadyExistsException, ResourceNotFoundException{
        CourseCreateResponseDto responseDto = courseService.createCourse(courseRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

}
