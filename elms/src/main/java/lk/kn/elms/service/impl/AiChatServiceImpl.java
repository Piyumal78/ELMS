package lk.kn.elms.service.impl;

import lk.kn.elms.service.AiChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiChatServiceImpl implements AiChatService {

    private final RestTemplate restTemplate;
    
    // n8n Cloud එකේ Production Webhook URL එක application.properties එකේ දාන්න
    // n8n.webhook.url=https://your-n8n-subdomain.app.n8n.cloud/webhook/chat-report
    @Value("${n8n.webhook.url:https://sanjanafernando.app.n8n.cloud/webhook/chat-report}")
    private String n8nWebhookUrl;

    @Override
    public String analyzeLabReport(MultipartFile file, String question) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", file.getResource());
            body.add("question", question);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // n8n වෙතින් එන JSON response එක Map එකකට ලබා ගැනීම
            ResponseEntity<Map> response = restTemplate.postForEntity(n8nWebhookUrl, requestEntity, Map.class);

            if (response.getBody() != null && response.getBody().containsKey("output")) {
                // n8n AI Agent එකේ පිළිතුර ඇත්තේ "output" යතුර යටතේය
                return response.getBody().get("output").toString(); 
            }
            return "No response from AI.";
        } catch (Exception e) {
            return "Error connecting to AI: " + e.getMessage();
        }
    }
}