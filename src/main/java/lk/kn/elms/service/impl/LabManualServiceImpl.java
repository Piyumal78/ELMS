package lk.kn.elms.service.impl;

import com.cloudinary.Cloudinary;
import lk.kn.elms.dto.response.LabManualCreateResponseDto;
import lk.kn.elms.exception.FileUploadingException;
import lk.kn.elms.exception.ResourceAlreadyExistsException;
import lk.kn.elms.exception.ResourceNotFoundException;
import lk.kn.elms.model.LabManual;
import lk.kn.elms.model.Session;
import lk.kn.elms.repository.LabManualRepository;
import lk.kn.elms.repository.SessionRepository;
import lk.kn.elms.service.LabManualService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@AllArgsConstructor
public class LabManualServiceImpl implements LabManualService {

    private LabManualRepository labManualRepository;
    private SessionRepository sessionRepository;
    private Cloudinary cloudinary;

    @Override
    public LabManualCreateResponseDto uploadLabManual(Long sessionId, MultipartFile file)
            throws ResourceAlreadyExistsException, ResourceNotFoundException, FileUploadingException {

        Session session = sessionRepository.findById(sessionId).orElseThrow(()->new ResourceNotFoundException("Session not found"));

        if (labManualRepository.existsBySessionId(sessionId)) {
            throw new ResourceAlreadyExistsException("There is already a lab manual with this session id");
        }

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

        LabManual labManual = new LabManual();
        labManual.setFileUrl(fileUrl);
        labManual.setFilePublicId(publicId);
        labManual.setSession(session);

        labManualRepository.save(labManual);

        LabManualCreateResponseDto labManualCreateResponseDto = new LabManualCreateResponseDto();
        labManualCreateResponseDto.setLabManualId(labManual.getId());
        labManualCreateResponseDto.setFileUrl(fileUrl);
        labManualCreateResponseDto.setFilePublicId(publicId);
        labManualCreateResponseDto.setSessionId(session.getId());
        labManualCreateResponseDto.setUploadedAt(session.getCreatedAt());

        return labManualCreateResponseDto;
    }
}
