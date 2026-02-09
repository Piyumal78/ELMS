package lk.kn.elms.controller;

import lk.kn.elms.service.AiChatService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@AllArgsConstructor
@CrossOrigin("*")
@RequestMapping("/elms/api/ai")
public class AiController {

    private final AiChatService aiChatService;

    @PostMapping("/analyze-report")
    public ResponseEntity<Map<String, String>> analyzeReport(
            @RequestParam("file") MultipartFile file,
            @RequestParam("question") String question) {
        
        String result = aiChatService.analyzeLabReport(file, question);
        
        Map<String, String> response = new HashMap<>();
        response.put("response", result);
        response.put("status", "success");
        
        return ResponseEntity.ok(response);
    }
}