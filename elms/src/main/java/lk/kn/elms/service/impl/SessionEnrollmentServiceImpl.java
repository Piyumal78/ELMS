package lk.kn.elms.service.impl;

import lk.kn.elms.dto.response.SessionEnrollmentResponseDto;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.model.Session;
import lk.kn.elms.model.SessionEnrollment;
import lk.kn.elms.model.Student;
import lk.kn.elms.repository.SessionEnrollmentRepository;
import lk.kn.elms.repository.SessionRepository;
import lk.kn.elms.repository.StudentRepository;
import lk.kn.elms.service.SessionEnrollmentService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class SessionEnrollmentServiceImpl implements SessionEnrollmentService {

    private SessionEnrollmentRepository sessionEnrollmentRepository;
    private StudentRepository studentRepository;
    private SessionRepository sessionRepository;

    @Override
    public SessionEnrollmentResponseDto enrollToSession(Long studentId, Long sessionId) throws ResourceNotFoundException, ResourceAlreadyExistsException {

        if (sessionEnrollmentRepository.existsByStudentIdAndSessionId(studentId,sessionId)){
            throw new ResourceAlreadyExistsException("Session enrollment with " +sessionId+ " and "+studentId+ " already exists");
        }

        Student student =  studentRepository.findById(studentId)
                .orElseThrow(()-> new ResourceNotFoundException("Student not found with " +studentId));

        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(()-> new ResourceNotFoundException("Session not found with " +sessionId));

        SessionEnrollment sessionEnrollment = new SessionEnrollment();
        sessionEnrollment.setStudent(student);
        sessionEnrollment.setSession(session);

        sessionRepository.save(session);

        SessionEnrollmentResponseDto responseDto = new SessionEnrollmentResponseDto();
        responseDto.setEnrollmentId(session.getId());
        responseDto.setSessionId(sessionId);
        responseDto.setStudentId(studentId);

        return responseDto;
    }
}
