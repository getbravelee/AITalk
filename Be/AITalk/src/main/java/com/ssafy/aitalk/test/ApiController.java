package com.ssafy.aitalk.test;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api") // 🔥 API 경로가 "/api"로 시작하도록 설정
public class ApiController {

    private final String FLASK_URL = "http://175.209.203.185:5220/process"; // GPU 서버 URL

    @PostMapping("/send")
    public ResponseEntity<String> sendRequestToFlask(@RequestBody Map<String, String> request) {
        System.out.println("Received from client: " + request);

        ResponseEntity<String> response = ResponseEntity.ok("{\"status\": \"sent to Flask\"}");
        return response;
    }

    // 🛠️ **Flask가 응답을 보낼 엔드포인트 추가**
    @PostMapping("/receive")
    public ResponseEntity<String> receiveFromFlask(@RequestBody Map<String, String> response) {
        System.out.println("Received from Flask: " + response);

        return ResponseEntity.ok("{\"status\": \"received from Flask\"}");
    }
}
