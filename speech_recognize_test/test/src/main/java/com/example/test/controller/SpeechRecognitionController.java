package com.example.test.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SpeechRecognitionController {

    private final RestTemplate restTemplate;

    public SpeechRecognitionController() {
        this.restTemplate = new RestTemplate();
    }

    @PostMapping("/start-recognition")
    public ResponseEntity<String> startRecognition() {
        String flaskApiUrl = "http://localhost:5000/start-recognition";

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(flaskApiUrl, null, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                return ResponseEntity.ok("음성 인식 시작됨");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error: Unable to start recognition.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error during API call: " + e.getMessage());
        }
    }

    @PostMapping("/stop-recognition")
    public ResponseEntity<String> stopRecognition() {
        String flaskApiUrl = "http://localhost:5000/stop-recognition";

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(flaskApiUrl, null, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                return ResponseEntity.ok("음성 인식 중지됨");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error: Unable to stop recognition.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error during API call: " + e.getMessage());
        }
    }
}
