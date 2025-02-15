package com.ssafy.aitalk.test;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ImageController {

    private static final String GPU_SERVER_URL = "http://175.209.203.185:5220/generate";
    private static final String IMAGE_SAVE_PATH = "/home/ubuntu/images/";
    private static final String EC2_IMAGE_BASE_URL = "http://3.38.106.51:7260/api/images/";

    private final Map<String, String> imageStatus = new HashMap<>();

    @PostMapping("/generate")
    public ResponseEntity<?> generateImage(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        if (prompt == null || prompt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Prompt is required"));
        }

        // ✅ 상태 초기화 (생성 중)
        imageStatus.put(prompt, "processing");
        System.out.println("🟡 이미지 생성 요청 수신: " + prompt);

        // GPU 서버로 요청 보내기
        RestTemplate restTemplate = new RestTemplate();
        Map<String, String> gpuRequest = new HashMap<>();
        gpuRequest.put("prompt", prompt);

        new Thread(() -> {
            try {
                ResponseEntity<Map> response = restTemplate.postForEntity(GPU_SERVER_URL, gpuRequest, Map.class);
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    String imageUrl = (String) response.getBody().get("image_url");
                    System.out.println("🟢 GPU 서버에서 이미지 URL 수신: " + imageUrl);

                    // ✅ GPU에서 전송된 이미지 다운로드 및 EC2에 저장
                    String savedFilePath = downloadImage(imageUrl, prompt);
                    if (savedFilePath != null) {
                        String ec2ImageUrl = EC2_IMAGE_BASE_URL + prompt + ".png";
                        imageStatus.put(prompt, ec2ImageUrl);
                        System.out.println("✅ EC2에 저장 완료: " + savedFilePath);
                    } else {
                        imageStatus.put(prompt, "failed");
                    }
                } else {
                    imageStatus.put(prompt, "failed");
                }
            } catch (Exception e) {
                e.printStackTrace();
                imageStatus.put(prompt, "failed");
            }
        }).start();

        return ResponseEntity.ok(Map.of("status", "processing"));
    }

    @GetMapping("/status")
    public ResponseEntity<?> getImageStatus(@RequestParam String prompt) {
        String status = imageStatus.getOrDefault(prompt, "not_found");
        System.out.println("🔍 상태 확인 요청: " + prompt + " -> " + status);
        return ResponseEntity.ok(Map.of("status", status));
    }

    // ✅ EC2에서 이미지 제공 (Jetson이 가져갈 수 있도록)
    @GetMapping("/images/{filename}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
        try {
            Path imagePath = Paths.get(IMAGE_SAVE_PATH).resolve(filename);
            Resource resource = new UrlResource(imagePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                System.out.println("📤 이미지 제공 요청: " + filename);
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_PNG)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=" + filename)
                        .body(resource);
            } else {
                System.out.println("❌ 이미지 찾을 수 없음: " + filename);
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    private String downloadImage(String imageUrl, String prompt) {
        try {
            System.out.println("🔄 GPU에서 이미지 다운로드 시도: " + imageUrl);
            URL url = new URL(imageUrl);
            InputStream in = url.openStream();

            // ✅ 프롬프트명으로 저장 (예: cat.png)
            String filename = IMAGE_SAVE_PATH + prompt + ".png";
            Files.copy(in, Paths.get(filename), StandardCopyOption.REPLACE_EXISTING);

            System.out.println("✅ 이미지 다운로드 완료: " + filename);
            return filename;
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("❌ 이미지 다운로드 실패: " + imageUrl);
            return null;
        }
    }
}