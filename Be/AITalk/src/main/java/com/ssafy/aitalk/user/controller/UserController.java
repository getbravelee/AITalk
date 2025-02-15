package com.ssafy.aitalk.user.controller;

import com.ssafy.aitalk.user.dto.*;
import com.ssafy.aitalk.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;

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

    @PostMapping("/send-email-verification")
    public ResponseEntity<String> sendEmailVerification(@RequestBody EmailVerificationRequest request) {
        try {
            userService.sendEmailVerification(request.getEmail());
            return ResponseEntity.ok("이메일 인증 코드가 전송되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("이메일 전송 실패");
        }
    }


    @PostMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestBody EmailVerificationConfirmRequest request) {
        if (userService.verifyEmail(request.getEmail(), request.getCode())) {
            return ResponseEntity.ok("이메일 인증 성공");
        } else {
            return ResponseEntity.status(400).body("인증 코드가 올바르지 않거나 만료되었습니다.");
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

    // 보호된 테스트 API (JWT 토큰이 있어야 접근 가능)
    @GetMapping("/protected")
    public ResponseEntity<String> protectedEndpoint() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String id = auth.getName();
        System.out.println("인증되었나요?:" + id);
        return ResponseEntity.ok("🎉 인증 성공! 이 메시지는 JWT 토큰이 유효할 때만 볼 수 있습니다.");
    }


    // 회원정보 불러오기
    @GetMapping("/info")
    public ResponseEntity<?> getUserInfo() {
//        System.out.println("테스트");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        int id = Integer.parseInt(authentication.getName());  // 현재 로그인한 사용자의 이름(name)
//        System.out.println("테스트" + id);

        try {
            UserResponse userResponse = userService.getUserInfo(id);
            return ResponseEntity.ok(userResponse);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
        }
    }

    // 회원정보 수정
    @PutMapping("/info")
    public ResponseEntity<UserUpdateResponse> updateUserInfo(@RequestBody @Valid UpdateInfoRequest request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            // 첫 번째 오류 메시지만 반환
            String errorMessage = bindingResult.getFieldErrors().get(0).getDefaultMessage();
            return ResponseEntity.status(400).body(new UserUpdateResponse("회원정보 수정 실패: " + errorMessage, null));
        }

        try {
            int id = Integer.parseInt(SecurityContextHolder.getContext().getAuthentication().getName());
            System.out.println("로그인한 사용자 ID: " + id);

            // 변경된 정보를 반환하는 메서드 호출
            UserUpdateResponse response = userService.updateUserInfo(id, request);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new UserUpdateResponse("회원정보 수정 실패: " + e.getMessage(), null));
        }
    }


    // 회원정보 삭제
    @DeleteMapping("/info")
    public ResponseEntity<UpdateInfoResponse> deleteUser() {
        try {
            // 현재 로그인한 사용자의 ID 가져오기
            int id = Integer.parseInt(SecurityContextHolder.getContext().getAuthentication().getName());

            // 회원 탈퇴 실행
            userService.deleteUser(id);

            return ResponseEntity.ok(new UpdateInfoResponse("회원 탈퇴가 완료되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new UpdateInfoResponse("회원 탈퇴 실패: " + e.getMessage()));
        }
    }


    // 아이디 찾기
    @PostMapping("/find-id")
    public ResponseEntity<UpdateInfoResponse> findUserId(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            userService.sendUserIdByEmail(email);
            return ResponseEntity.ok(new UpdateInfoResponse("아이디가 이메일로 전송되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new UpdateInfoResponse("올바른 이메일 주소를 입력해주세요"));
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new UpdateInfoResponse("해당 이메일을 사용하는 계정을 찾을 수 없습니다."));
        }
    }


    // 비밀번호 찾기
    // 1️⃣ 인증코드 발송 (아이디 입력)
    @PostMapping("/send-verification-code")
    public ResponseEntity<PasswordResponse> sendVerificationCode(@RequestBody SendVerificationCodeRequest request) {
        userService.sendVerificationCode(request.getId());
        return ResponseEntity.ok(new PasswordResponse("인증코드가 이메일로 전송되었습니다."));
    }

    // 2️⃣ 인증코드 확인
    @PostMapping("/verify-code")
    public ResponseEntity<PasswordResponse> verifyCode(@RequestBody VerifyCodeRequest request) {
        boolean isVerified = userService.verifyCode(request.getId(), request.getCode());

        if (isVerified) {
            return ResponseEntity.ok(new PasswordResponse("인증 성공"));
        } else {
            return ResponseEntity.badRequest().body(new PasswordResponse("인증코드가 일치하지 않습니다."));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<PasswordResponse> changePassword(@RequestBody @Valid ChangePasswordRequest request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            // 첫 번째 오류 메시지만 반환
            String errorMessage = bindingResult.getFieldErrors().get(0).getDefaultMessage();
            return ResponseEntity.status(400).body(new PasswordResponse("회원가입 실패 : " + errorMessage));
        }
        try{
            userService.updatePassword(request);
            return ResponseEntity.ok(new PasswordResponse("비밀번호가 성공적으로 변경되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(new PasswordResponse(e.getMessage()));
        }

    }





}





