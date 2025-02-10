package com.ssafy.aitalk.test;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api") // 🔥 API 경로가 "/api"로 시작하도록 설정
public class ApiController {

    private final String FLASK_URL = "http://70.12.130.121:5220/process"; // GPU 서버 URL
    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/send")
    public ResponseEntity<String> sendRequestToFlask(@RequestBody Map<String, String> request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(request, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(FLASK_URL, entity, String.class);

        return ResponseEntity.ok(response.getBody());
    }
}
