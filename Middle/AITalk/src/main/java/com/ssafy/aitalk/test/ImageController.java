package com.ssafy.aitalk.test;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.io.*;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ImageController {

    private static final String GPU_SERVER_URL = "http://175.209.203.185:5220/generate";
    private static final String IMAGE_SAVE_PATH = "/home/ubuntu/images/";
    private static final String EC2_IMAGE_BASE_URL = "http://3.38.106.51:7260/images/";

    private final Map<String, String> imageStatus = new HashMap<>();

    @PostMapping("/generate")
    public ResponseEntity<?> generateImage(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        if (prompt == null || prompt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Prompt is required"));
        }

        // 상태 초기화 (생성 중)
        imageStatus.put(prompt, "pending");

        // GPU 서버로 요청 보내기
        RestTemplate restTemplate = new RestTemplate();
        Map<String, String> gpuRequest = new HashMap<>();
        gpuRequest.put("prompt", prompt);

        new Thread(() -> {
            ResponseEntity<Map> response = restTemplate.postForEntity(GPU_SERVER_URL, gpuRequest, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                String imageUrl = (String) response.getBody().get("image_url");

                // GPU에서 전송된 이미지 다운로드 및 EC2에 저장
                String savedFilePath = downloadImage(imageUrl, prompt);
                if (savedFilePath != null) {
                    String ec2ImageUrl = EC2_IMAGE_BASE_URL + new File(savedFilePath).getName();
                    imageStatus.put(prompt, ec2ImageUrl);
                } else {
                    imageStatus.put(prompt, "failed");
                }
            } else {
                imageStatus.put(prompt, "failed");
            }
        }).start();

        return ResponseEntity.ok(Map.of("status", "processing"));
    }

    @GetMapping("/status")
    public ResponseEntity<?> getImageStatus(@RequestParam String prompt) {
        String status = imageStatus.getOrDefault(prompt, "not_found");
        return ResponseEntity.ok(Map.of("status", status));
    }

    private String downloadImage(String imageUrl, String prompt) {
        try {
            URL url = new URL(imageUrl);
            InputStream in = url.openStream();

            // **파일 이름을 프롬프트 기반으로 저장**
            String filename = IMAGE_SAVE_PATH + prompt + ".png";
            Files.copy(in, Paths.get(filename), StandardCopyOption.REPLACE_EXISTING);
            return filename;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}