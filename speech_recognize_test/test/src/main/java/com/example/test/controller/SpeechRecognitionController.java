package com.example.test.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SpeechRecognitionController {

    private final RestTemplate restTemplate;

    public SpeechRecognitionController() {
        this.restTemplate = new RestTemplate();
    }

    @GetMapping("/get-recognized-text")
    public ResponseEntity<String> getRecognizedText() {
        System.out.println("isCome");
        // Flask API 엔드포인트 URL (Flask 서버가 로컬에서 실행 중이라면 localhost)
        String flaskApiUrl = "http://localhost:5000/recognize";

        try {
            // Flask API 호출
            ResponseEntity<String> response = restTemplate.getForEntity(flaskApiUrl, String.class);

            // Flask API 호출이 성공적인 경우
            if (response.getStatusCode() == HttpStatus.OK) {
                return ResponseEntity.ok(response.getBody());  // 성공적인 텍스트 응답
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error: Unable to process audio.");
            }
        } catch (Exception e) {
            // 예외 처리: Flask API 호출 실패 시
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error during API call: " + e.getMessage());
        }
    }
}


