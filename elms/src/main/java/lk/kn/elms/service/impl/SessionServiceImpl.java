package lk.kn.elms.service.impl;

import com.cloudinary.Cloudinary;
import lk.kn.elms.dto.request.SessionRequestDto;
import lk.kn.elms.dto.response.SessionCreateResponseDto;
import lk.kn.elms.exception.FileUploadingException;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.model.Course;
import lk.kn.elms.model.Session;
import lk.kn.elms.model.User;
import lk.kn.elms.repository.CourseRepository;
import lk.kn.elms.repository.SessionRepository;
import lk.kn.elms.repository.UserRepository;
import lk.kn.elms.service.SessionService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@AllArgsConstructor
public class SessionServiceImpl implements SessionService {

    private SessionRepository sessionRepository;
    private UserRepository userRepository;
    private CourseRepository courseRepository;
    private Cloudinary cloudinary;

    //********************************************
    //User need to get from security context
    @Override
    public SessionCreateResponseDto createSession(SessionRequestDto sessionRequestDto, MultipartFile file)
            throws FileUploadingException, ResourceAlreadyExistsException, ResourceNotFoundException {

        boolean existsOverlappingSession = sessionRepository.existsOverlappingSession(
                sessionRequestDto.getDate(),
                sessionRequestDto.getStartTime(),
                sessionRequestDto.getEndTime());

        if (existsOverlappingSession) {
            throw new ResourceAlreadyExistsException("There is already an existing session on this date and time");
        }

        User user = userRepository.findById(sessionRequestDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("There is no user with user id " + sessionRequestDto.getUserId()));

        Course course = courseRepository.findById(sessionRequestDto.getCourseId())
                .orElseThrow(()-> new ResourceNotFoundException("There is no course with course id " + sessionRequestDto.getCourseId()));

        if (file == null || file.isEmpty()) {
            throw new FileUploadingException("File is empty");
        }

        String uploadFolder = "ELMS/Lab Manuals";
        Map uploadResult;

        try {
            uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    Map.of(
                            "public_id", UUID.randomUUID().toString(),
                            "folder", uploadFolder
                    )
            );
        } catch (IOException e) {
            throw new FileUploadingException("Failed to read uploaded file");
        }

        String fileUrl = uploadResult.get("secure_url").toString();
        String publicId = uploadResult.get("public_id").toString();

        Session session = new Session();
        session.setDate(sessionRequestDto.getDate());
        session.setStartTime(sessionRequestDto.getStartTime());
        session.setEndTime(sessionRequestDto.getEndTime());
        session.setFileUrl(fileUrl);
        session.setFilePublicId(publicId);
        session.setCourse(course);
        session.setCreatedUser(user);

        sessionRepository.save(session);

        SessionCreateResponseDto sessionCreateResponseDto = new SessionCreateResponseDto();
        sessionCreateResponseDto.setSessionId(session.getId());
        sessionCreateResponseDto.setDate(session.getDate());
        sessionCreateResponseDto.setStartTime(session.getStartTime());
        sessionCreateResponseDto.setEndTime(session.getEndTime());
        sessionCreateResponseDto.setFileUrl(session.getFileUrl());
        sessionCreateResponseDto.setFilePublicId(session.getFilePublicId());
        sessionCreateResponseDto.setCourseId(sessionRequestDto.getCourseId());
        sessionCreateResponseDto.setCourseCode(course.getCourseCode());
        sessionCreateResponseDto.setCourseName(course.getCourseName());
        sessionCreateResponseDto.setCreatedAt(session.getCreatedAt());
        sessionCreateResponseDto.setUpdatedAt(session.getUpdatedAt());

        return sessionCreateResponseDto;

    }


}
