package com.ssafy.aitalk.user.controller;

import com.ssafy.aitalk.user.entity.User;
import com.ssafy.aitalk.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.ssafy.aitalk.user.dto.LoginRequest;
import com.ssafy.aitalk.user.dto.LoginResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;


@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;


    // 간단 회원가입
    @PostMapping("/signup")
    public String registerUser(@RequestBody User user) {
        userService.registerUser(user);
        return "회원가입이 완료되었습니다. therapist_id: " + user.getTherapistId();
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<Integer> loginUser(@RequestBody LoginRequest request) {
        LoginResponse response = userService.login(request);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + response.getToken());

        return ResponseEntity.ok()
                .headers(headers)
                .body(response.getTherapistId());  // 200 OK와 함께 therapist_id 및 JWT 토큰 반환
    }
}
