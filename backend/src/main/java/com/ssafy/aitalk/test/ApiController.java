package com.ssafy.aitalk.test;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final String GPU_SERVER_URL = "http://70.12.130.121:5220/process";

    @GetMapping("/test")
    public ResponseEntity<String> sendRequestToGPU() {
        RestTemplate restTemplate = new RestTemplate();
        Map<String, String> requestBody = Map.of("message", "Hello from EC2");

        ResponseEntity<Map> response = restTemplate.postForEntity(GPU_SERVER_URL, requestBody, Map.class);

        return ResponseEntity.ok("GPU Response: " + response.getBody());
    }
}
