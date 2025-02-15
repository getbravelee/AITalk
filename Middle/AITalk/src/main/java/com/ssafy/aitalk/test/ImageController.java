package com.ssafy.aitalk.test;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ImageController {

    private static final String GPU_SERVER_URL = "http://175.209.203.185:5220/generate";
    private static final String IMAGE_SAVE_PATH = "/home/ubuntu/images/";
    private static final String EC2_IMAGE_BASE_URL = "http://3.38.106.51:5000/images/";

    private final Map<String, String> imageStatus = new HashMap<>();

    @PostMapping("/generate")
    public ResponseEntity<?> generateImage(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        if (prompt == null || prompt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Prompt is required"));
        }

        // GPU 서버에 요청
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.postForEntity(GPU_SERVER_URL, request, Map.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            String imageUrl = (String) response.getBody().get("image_url");

            // EC2에 이미지 다운로드 및 저장
            String savedFilePath = downloadImage(imageUrl, prompt);
            if (savedFilePath != null) {
                String ec2ImageUrl = EC2_IMAGE_BASE_URL + new File(savedFilePath).getName();
                return ResponseEntity.ok(Map.of("image_url", ec2ImageUrl));
            }
        }
        return ResponseEntity.status(500).body(Map.of("error", "Image generation failed"));
    }

    private String downloadImage(String imageUrl, String prompt) {
        try {
            URL url = new URL(imageUrl);
            InputStream in = url.openStream();
            String filename = IMAGE_SAVE_PATH + prompt + ".png";  // 🚀 파일명 유지
            Files.copy(in, Paths.get(filename), StandardCopyOption.REPLACE_EXISTING);
            return filename;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}