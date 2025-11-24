package lk.kn.elms.service.impl;

import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.model.Student;
import lk.kn.elms.repository.StudentRepository;
import lk.kn.elms.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Override
    public Student saveStudent(Student student){
        return studentRepository.save(student);
    }

    @Override
    public List<Student> getAllStudent(){
        return studentRepository.findAll();
    }

    @Override
    public Student getStudentRegistrationNumber(String registrationNumber){
        Optional<Student> student = studentRepository.findByRegistrationNumber(registrationNumber);
        if (student.isPresent()){
            return student.get();
        } else {
            throw new ResourceNotFoundException("Student not found");
        }
    }

    @Override
    public Student updateStudentByRegistaionNumber(Student student, String registrationNumber){
        Student updateStudent = studentRepository.findByRegistrationNumber(registrationNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with registration number: " + registrationNumber));

        updateStudent.setCourseEnrollments(student.getCourseEnrollments());
        updateStudent.setLabReservations(student.getLabReservations());
        updateStudent.setReportSubmissions(student.getReportSubmissions());
        updateStudent.setAnnouncements(student.getAnnouncements());
        updateStudent.setComponentHandovers(student.getComponentHandovers());
        updateStudent.setName(student.getName());
        updateStudent.setSessionEnrollments(student.getSessionEnrollments());

        return studentRepository.save(updateStudent);
    }

    @Override
    public void deleteStudent(String registrationNo){
        Student studentToDelete = studentRepository.findByRegistrationNumber(registrationNo)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with registration number: " + registrationNo));

        studentRepository.delete(studentToDelete);
    }
}