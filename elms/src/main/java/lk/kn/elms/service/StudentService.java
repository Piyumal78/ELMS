package lk.kn.elms.service;

import lk.kn.elms.model.Student;
import java.util.List;

public interface StudentService {
    Student saveStudent(Student student);
    Student updateStudentByRegistaionNumber(Student student, String registrationNumber);
    void deleteStudent(String registrationNumber);
    Student getStudentRegistrationNumber(String registrationNumber);
    List<Student> getAllStudent();
}