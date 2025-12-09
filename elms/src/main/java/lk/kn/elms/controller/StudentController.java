package lk.kn.elms.controller;

import jakarta.validation.Valid;
import lk.kn.elms.dto.request.StudentRequestDto;
import lk.kn.elms.dto.response.StudentCreateResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.service.StudentService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@CrossOrigin("*")
@RequestMapping(value = "/elms/api")
public class StudentController {

    private StudentService studentService;

    @PostMapping("/students")
    public ResponseEntity<StudentCreateResponseDto> createStudent(@Valid @RequestBody StudentRequestDto studentRequestDto) throws ResourceAlreadyExistsException {
        StudentCreateResponseDto responseDto = studentService.createStudent(studentRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }
}
