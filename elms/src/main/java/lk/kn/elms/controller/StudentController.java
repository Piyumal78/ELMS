package lk.kn.elms.controller;

import lk.kn.elms.model.Student;
import lk.kn.elms.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/student")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping
    public ResponseEntity<Student> saveStudent(@RequestBody Student student) {
        return new ResponseEntity<>(studentService.saveStudent(student), HttpStatus.CREATED);
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudent();
    }

    @GetMapping("/{registrationNumber}")
    public ResponseEntity<Student> getStudentByRegistrationNumber(@PathVariable String registrationNumber) {
        return new ResponseEntity<>(studentService.getStudentRegistrationNumber(registrationNumber), HttpStatus.OK);
    }

    @PutMapping("/{registrationNumber}")
    public ResponseEntity<Student> updateStudent(
            @PathVariable String registrationNumber,
            @RequestBody Student student) {

        Student updatedStudent = studentService.updateStudentByRegistaionNumber(student, registrationNumber);
        return new ResponseEntity<>(updatedStudent, HttpStatus.OK);
    }

    @DeleteMapping("/{registrationNumber}")
    public ResponseEntity<String> deleteStudent(@PathVariable String registrationNumber) {
        studentService.deleteStudent(registrationNumber);
        return new ResponseEntity<>("Student deleted Successfully", HttpStatus.OK);
    }
}