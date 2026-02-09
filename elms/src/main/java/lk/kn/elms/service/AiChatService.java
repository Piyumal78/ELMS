package lk.kn.elms.service;
import org.springframework.web.multipart.MultipartFile;

public interface AiChatService {

   String analyzeLabReport(MultipartFile file, String question);

}
