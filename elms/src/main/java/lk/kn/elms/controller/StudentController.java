package lk.kn.elms.controller;

import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lk.kn.elms.dto.request.StudentRequestDto;
import lk.kn.elms.dto.request.StudentUpdateRequestDto;
import lk.kn.elms.dto.response.*;
import lk.kn.elms.exception.FileUploadingException;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.service.StudentService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@AllArgsConstructor
@CrossOrigin("*")
@RequestMapping(value = "/elms/api")
public class StudentController {

    private StudentService studentService;

    @RolesAllowed({"ADMIN"})
    @PostMapping("/students")
    public ResponseEntity<StudentCreateResponseDto> createStudent(@Valid @RequestBody StudentRequestDto studentRequestDto) throws ResourceAlreadyExistsException {
        StudentCreateResponseDto responseDto = studentService.createStudent(studentRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @RolesAllowed({"STUDENT"})
    @GetMapping("/students/{studentId}")
    public ResponseEntity<StudentResponseDto> getStudent(@PathVariable Long studentId) throws ResourceNotFoundException {
        StudentResponseDto responseDto = studentService.getStudent(studentId);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @RolesAllowed({"STUDENT"})
    @PutMapping("/students/{studentId}")
    public ResponseEntity<StudentDetailUpdateResponseDto> updateStudent(@PathVariable Long studentId,@Valid @RequestBody StudentUpdateRequestDto studentUpdateRequestDto) throws ResourceNotFoundException {
        StudentDetailUpdateResponseDto responseDto = studentService.updateStudent(studentId, studentUpdateRequestDto);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }

    @RolesAllowed({"STUDENT"})
    @PostMapping(value = "/students/profile-photos/{studentId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<StudentPhotoResponseDto> uploadProfilePhoto(
            @PathVariable Long studentId,
            @RequestPart("file") MultipartFile file
    ) throws ResourceAlreadyExistsException, ResourceNotFoundException, FileUploadingException {

        StudentPhotoResponseDto response = studentService.uploadProfilePhoto(studentId, file);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @RolesAllowed({"STUDENT"})
    @PatchMapping("/students/profile-photos/{studentId}")
    public ResponseEntity<String> deleteProfilePhoto(@PathVariable Long studentId) throws ResourceNotFoundException {
        studentService.deleteProfilePhoto(studentId);
        return ResponseEntity.status(HttpStatus.OK).body("Profile photo deleted successfully!");
    }
}
