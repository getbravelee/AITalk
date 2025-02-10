package com.ssafy.aitalk.test;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/image")
public class ImageController {

    private final String FLASK_API_URL = "http://175.209.203.185:5220/generate"; // Flask 서버 URL
    private final RestTemplate restTemplate = new RestTemplate();

    // 🖼️ **Flask로 이미지 생성 요청**
    @PostMapping("/generate")
    public ResponseEntity<?> generateImage(@RequestParam String prompt) {
        System.out.println("📤 Spring → Flask 요청: " + prompt);

        try {
            // 요청 데이터 생성
            Map<String, String> requestBody = Map.of("prompt", prompt);

            // HTTP 헤더 설정 (JSON 요청)
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

            // Flask API 호출
            ResponseEntity<Map> response = restTemplate.postForEntity(FLASK_API_URL, entity, Map.class);

            System.out.println("✅ Flask 응답: " + response.getBody());

            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            System.err.println("❌ Flask 요청 실패: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Flask 요청 실패"));
        }
    }
}