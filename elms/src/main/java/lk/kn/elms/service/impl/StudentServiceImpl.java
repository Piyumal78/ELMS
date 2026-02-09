package lk.kn.elms.service.impl;

import com.cloudinary.Cloudinary;
import lk.kn.elms.dto.request.StudentRequestDto;
import lk.kn.elms.dto.request.StudentUpdateRequestDto;
import lk.kn.elms.dto.response.*;
import lk.kn.elms.exception.FileUploadingException;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.model.*;
import lk.kn.elms.model.enums.UserRole;
import lk.kn.elms.repository.StudentRepository;
import lk.kn.elms.service.StudentService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@AllArgsConstructor
public class StudentServiceImpl implements StudentService {

    private StudentRepository studentRepository;
    private Cloudinary cloudinary;
    private PasswordEncoder passwordEncoder;

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

    @Override
    public StudentDetailUpdateResponseDto updateStudent(Long id, StudentUpdateRequestDto studentUpdateRequestDto) throws ResourceNotFoundException {
        Student student = studentRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Student not found!"));

        String dbExistingPassword = student.getPassword();

        if (!passwordEncoder.matches(studentUpdateRequestDto.getExistingPassword(), dbExistingPassword)) {
            throw new ResourceNotFoundException("Password does not match!");
        }

        student.setPassword(studentUpdateRequestDto.getNewPassword());
        student.setName(studentUpdateRequestDto.getName());
        student.setEmail(studentUpdateRequestDto.getEmail());

        studentRepository.save(student);

        StudentDetailUpdateResponseDto studentUpdateResponseDto = new StudentDetailUpdateResponseDto();
        studentUpdateResponseDto.setStudentId(id);
        studentUpdateResponseDto.setName(studentUpdateRequestDto.getName());
        studentUpdateResponseDto.setEmail(studentUpdateRequestDto.getEmail());
        studentUpdateResponseDto.setPassword(student.getPassword());
        return studentUpdateResponseDto;

    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponseDto getStudent(Long id) throws ResourceNotFoundException {

        Student student = studentRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Student not found!"));
        StudentResponseDto studentResponseDto = new StudentResponseDto();
        studentResponseDto.setId(student.getId());
        studentResponseDto.setName(student.getName());
        studentResponseDto.setEmail(student.getEmail());
        studentResponseDto.setPassword(student.getPassword());
        studentResponseDto.setFileUrl(student.getFileUrl());
        student.setFilePublicId(student.getFilePublicId());

        List<StudentCourseResponseDto> studentCourseResponseDtoList = new ArrayList<>();
        List<CourseEnrollment> courseEnrollments = student.getCourseEnrollments();
        for (CourseEnrollment courseEnrollment : courseEnrollments) {
            StudentCourseResponseDto studentCourseResponseDto = new StudentCourseResponseDto();
            studentCourseResponseDto.setCourseId(courseEnrollment.getCourse().getId());
            studentCourseResponseDto.setCourseCode(courseEnrollment.getCourse().getCourseCode());
            studentCourseResponseDto.setCourseName(courseEnrollment.getCourse().getCourseName());
            studentCourseResponseDtoList.add(studentCourseResponseDto);
        }
        studentResponseDto.setCourseResponseDtoList(studentCourseResponseDtoList);

        return studentResponseDto;
    }

    @Override
    public StudentPhotoResponseDto uploadProfilePhoto(Long studentId, MultipartFile file) throws ResourceAlreadyExistsException, ResourceNotFoundException, FileUploadingException {

        Student student = studentRepository.findById(studentId).orElseThrow(()->new ResourceNotFoundException("Student not found"));

        if (file == null || file.isEmpty()) {
            throw new FileUploadingException("File is empty");
        }

        String uploadFolder = "ELMS/Profile Photos";
        Map uploadResult;

        try {
            Map<String, String> uploadParams = new HashMap<>();
            uploadParams.put("public_id", UUID.randomUUID().toString());
            uploadParams.put("folder", uploadFolder);
            uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    uploadParams
            );
        } catch (IOException e) {
            throw new FileUploadingException("Failed to read uploaded file");
        }

        String fileUrl = uploadResult.get("secure_url").toString();
        String publicId = uploadResult.get("public_id").toString();

        student.setFileUrl(fileUrl);
        student.setFilePublicId(publicId);

        studentRepository.save(student);

        StudentPhotoResponseDto studentPhotoResponseDto = new StudentPhotoResponseDto();
        studentPhotoResponseDto.setStudentId(studentId);
        studentPhotoResponseDto.setFileUrl(fileUrl);
        studentPhotoResponseDto.setFilePublicId(publicId);

        return studentPhotoResponseDto;
    }

    @Override
    public void deleteProfilePhoto(Long studentId) throws ResourceNotFoundException {

        Student student = studentRepository.findById(studentId).orElseThrow(()->new ResourceNotFoundException("Student not found"));

        student.setFilePublicId(null);
        student.setFileUrl(null);
        studentRepository.save(student);
    }

    @Override
    public String getImageUrl(Long studentId) throws ResourceNotFoundException {
        Student student = studentRepository.findById(studentId).orElseThrow(()->new ResourceNotFoundException("Student not found"));
        return student.getFileUrl();
    }
}
