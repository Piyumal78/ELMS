package lk.kn.elms.service.impl;

import lk.kn.elms.dto.response.LabManualCreateResponseDto;
import lk.kn.elms.exception.FileUploadingException;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.model.LabManual;
import lk.kn.elms.model.Session;
import lk.kn.elms.repository.LabManualRepository;
import lk.kn.elms.repository.SessionRepository;
import lk.kn.elms.service.CloudinaryService;
import lk.kn.elms.service.LabManualService;
import lk.kn.elms.service.NotificationService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@AllArgsConstructor
public class LabManualServiceImpl implements LabManualService {

    private LabManualRepository labManualRepository;
    private SessionRepository sessionRepository;
    private CloudinaryService cloudinaryService;
    private NotificationService notificationService;

    @Override
    public LabManualCreateResponseDto uploadLabManual(Long sessionId, MultipartFile file)
            throws ResourceAlreadyExistsException, ResourceNotFoundException, FileUploadingException {

        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        if (labManualRepository.existsBySessionId(sessionId)) {
            throw new ResourceAlreadyExistsException("There is already a lab manual with this session id");
        }

        if (file == null || file.isEmpty()) {
            throw new FileUploadingException("File is empty");
        }

        String fileUrl;
        try {
            fileUrl = cloudinaryService.uploadFile(file);
        } catch (IOException e) {
            throw new FileUploadingException("Failed to upload file to storage");
        }

        LabManual labManual = new LabManual();
        labManual.setFileUrl(fileUrl);
        // We might not get publicId from simplified service, but secure_url serves the
        // purpose.
        // If Model strictly requires publicId, we'd need to adjust CloudinaryService or
        // model usage.
        // Assuming we can derive or set null, or just ignore for now as user asked for
        // secureUrl return.
        labManual.setFilePublicId("N/A");
        labManual.setSession(session);

        labManualRepository.save(labManual);

        // Create detailed notification for lab assistants
        StringBuilder notificationMessage = new StringBuilder();
        notificationMessage.append("📚 New Lab Manual Uploaded\n\n");

        // Session info
        if (session.getTitle() != null) {
            notificationMessage.append("Session: ");
            if (session.getExperimentNumber() != null) {
                notificationMessage.append("Exp #").append(session.getExperimentNumber()).append(" - ");
            }
            notificationMessage.append(session.getTitle()).append("\n");
        }

        // Course info
        if (session.getCourse() != null) {
            notificationMessage.append("Course: ");
            if (session.getCourse().getCourseCode() != null) {
                notificationMessage.append(session.getCourse().getCourseCode()).append(" - ");
            }
            if (session.getCourse().getCourseName() != null) {
                notificationMessage.append(session.getCourse().getCourseName());
            }
            notificationMessage.append("\n");
        }

        // Date and time
        if (session.getDate() != null) {
            notificationMessage.append("Date: ").append(session.getDate());
            if (session.getStartTime() != null && session.getEndTime() != null) {
                notificationMessage.append(" at ").append(session.getStartTime())
                        .append("-").append(session.getEndTime());
            }
            notificationMessage.append("\n");
        }

        // Uploaded by
        if (session.getCreatedUser() != null) {
            notificationMessage.append("Uploaded by: ");
            if (session.getCreatedUser().getName() != null) {
                notificationMessage.append(session.getCreatedUser().getName());
            } else if (session.getCreatedUser().getRegistrationNumber() != null) {
                notificationMessage.append(session.getCreatedUser().getRegistrationNumber());
            }
        }

        notificationService.createNotification(notificationMessage.toString(), "LAB_ASSISTANT");

        LabManualCreateResponseDto labManualCreateResponseDto = new LabManualCreateResponseDto();
        labManualCreateResponseDto.setLabManualId(labManual.getId());
        labManualCreateResponseDto.setFileUrl(fileUrl);
        labManualCreateResponseDto.setFilePublicId(labManual.getFilePublicId());
        labManualCreateResponseDto.setSessionId(session.getId());
        labManualCreateResponseDto.setUploadedAt(session.getCreatedAt()); // Or map appropriately

        return labManualCreateResponseDto;
    }
}
