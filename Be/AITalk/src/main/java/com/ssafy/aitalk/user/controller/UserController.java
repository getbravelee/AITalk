package com.ssafy.aitalk.user.controller;

import com.ssafy.aitalk.user.dto.RegisterRequest;
//import com.ssafy.aitalk.user.entity.User;
import com.ssafy.aitalk.user.dto.RegisterResponse;
import com.ssafy.aitalk.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import com.ssafy.aitalk.user.dto.LoginRequest;
import com.ssafy.aitalk.user.dto.LoginResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<RegisterResponse> registerUser(@Valid @RequestBody RegisterRequest request, BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            // 첫 번째 오류 메시지만 반환
            String errorMessage = bindingResult.getFieldErrors().get(0).getDefaultMessage();
            return ResponseEntity.status(400).body(new RegisterResponse("회원가입 실패 : " + errorMessage));
        }

        try {
            userService.registerUser(request);

            return ResponseEntity.status(201).body(new RegisterResponse("회원가입 완료"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(new RegisterResponse("회원가입 실패 : " + e.getMessage()));
        }
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

//    @GetMapping("/")
//    public ResponseEntity<Response> userInfo() {
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//
//        }

}
