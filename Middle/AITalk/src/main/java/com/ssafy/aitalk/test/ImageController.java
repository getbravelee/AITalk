package com.ssafy.aitalk.test;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ImageController {

    private static final String GPU_SERVER_URL = "http://175.209.203.185:5220/generate";

    @PostMapping("/generate")
    public ResponseEntity<?> generateImage(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        if (prompt == null || prompt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Prompt is required"));
        }

        // GPU 서버로 요청 보내기
        RestTemplate restTemplate = new RestTemplate();
        Map<String, String> gpuRequest = new HashMap<>();
        gpuRequest.put("prompt", prompt);

        ResponseEntity<Map> response = restTemplate.postForEntity(GPU_SERVER_URL, gpuRequest, Map.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            return ResponseEntity.ok(response.getBody());  // GPU에서 받은 image_url을 Jetson에 전달
        } else {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to get image from GPU"));
        }
    }
}