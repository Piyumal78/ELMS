package lk.kn.elms.service.impl;

import lk.kn.elms.dto.request.StudentRequestDto;
import lk.kn.elms.dto.response.StudentCreateResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.model.Student;
import lk.kn.elms.model.enums.UserRole;
import lk.kn.elms.repository.StudentRepository;
import lk.kn.elms.service.StudentService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class StudentServiceImpl implements StudentService {

    private StudentRepository studentRepository;

    @Override
    public StudentCreateResponseDto createStudent(StudentRequestDto studentRequestDto) throws ResourceAlreadyExistsException {

        if (studentRepository.existsByEmail(studentRequestDto.getEmail())) {
            throw new ResourceAlreadyExistsException("Student with email " + studentRequestDto.getEmail() + " already exists.");
        }
        if (studentRepository.existsByRegistrationNumber(studentRequestDto.getRegistrationNumber())) {
            throw new ResourceAlreadyExistsException("Student with registration number " + studentRequestDto.getRegistrationNumber() + " already exists.");
        }

        Student student = new Student();
        student.setRegistrationNumber(studentRequestDto.getRegistrationNumber());
        student.setName(studentRequestDto.getName());
        student.setEmail(studentRequestDto.getEmail());
        student.setRole(UserRole.ROLE_STUDENT);

        studentRepository.save(student);

        StudentCreateResponseDto responseDto = new StudentCreateResponseDto();
        responseDto.setStudentId(student.getId());
        responseDto.setRegistrationNumber(student.getRegistrationNumber());
        responseDto.setName(student.getName());
        responseDto.setEmail(student.getEmail());
        responseDto.setCreatedDate(student.getCreatedAt());
        responseDto.setUpdatedDate(student.getUpdatedAt());

        return responseDto;
    }
}
