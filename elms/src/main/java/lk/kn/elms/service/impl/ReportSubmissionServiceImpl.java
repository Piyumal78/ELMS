package lk.kn.elms.service.impl;

import com.cloudinary.Cloudinary;
import lk.kn.elms.dto.response.ReportSubmissionCreateResponseDto;
import lk.kn.elms.exception.FileUploadingException;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.model.ReportSubmission;
import lk.kn.elms.model.Session;
import lk.kn.elms.model.Student;
import lk.kn.elms.repository.ReportSubmissionRepository;
import lk.kn.elms.repository.SessionRepository;
import lk.kn.elms.repository.StudentRepository;
import lk.kn.elms.service.ReportSubmissionService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ReportSubmissionServiceImpl implements ReportSubmissionService {

    private ReportSubmissionRepository reportSubmissionRepository;
    private StudentRepository studentRepository;
    private SessionRepository sessionRepository;
    private Cloudinary cloudinary;


    //************
    //Need to set student from security context
    @Override
    public ReportSubmissionCreateResponseDto createSubmission(Long studentId, Long sessionId, MultipartFile file)
            throws ResourceAlreadyExistsException, ResourceNotFoundException, FileUploadingException {

        if (reportSubmissionRepository.existsByStudentIdAndSessionId(studentId, sessionId)) {
            throw new ResourceAlreadyExistsException("Already submitted");
        }

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with student id " + studentId));

        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with session id " + sessionId));

        if (file == null || file.isEmpty()) {
            throw new FileUploadingException("File is empty");
        }

        String uploadFolder = "ELMS/Lab Reports";
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

        ReportSubmission reportSubmission = new ReportSubmission();
        reportSubmission.setFileUrl(fileUrl);
        reportSubmission.setFilePublicId(publicId);
        reportSubmission.setStudent(student);
        reportSubmission.setSession(session);

        reportSubmissionRepository.save(reportSubmission);

        ReportSubmissionCreateResponseDto reportSubmissionCreateResponseDto = new ReportSubmissionCreateResponseDto();
        reportSubmissionCreateResponseDto.setSubmissionId(reportSubmission.getId());
        reportSubmissionCreateResponseDto.setFileUrl(fileUrl);
        reportSubmissionCreateResponseDto.setFilePublicId(publicId);
        reportSubmissionCreateResponseDto.setSessionId(sessionId);
        reportSubmissionCreateResponseDto.setStudentId(studentId);
        reportSubmissionCreateResponseDto.setSubmittedAt(reportSubmission.getSubmittedAt());

        return reportSubmissionCreateResponseDto;
    }
}