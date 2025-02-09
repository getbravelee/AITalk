package com.ssafy.aitalk.user.controller;

import com.ssafy.aitalk.user.dto.*;
import com.ssafy.aitalk.user.entity.User;
import com.ssafy.aitalk.user.service.UserService;
import jakarta.validation.Valid;
import org.mybatis.logging.Logger;
import org.mybatis.logging.LoggerFactory;
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
    public ResponseEntity<UpdateInfoResponse> updateUserInfo(@RequestBody @Valid UpdateInfoRequest request) {
        try {
            int id = Integer.parseInt(SecurityContextHolder.getContext().getAuthentication().getName());
            System.out.println("로그인한 사용자 ID: " + id);

            userService.updateUserInfo(id, request);


            // JSON 응답
            return ResponseEntity.ok(new UpdateInfoResponse("수정되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new UpdateInfoResponse("회원정보 수정 실패: " + e.getMessage()));
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

    // 비밀번호 변경
    @PostMapping("/change-password")
    public ResponseEntity<UpdateInfoResponse> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String newPassword = request.get("password");
            userService.updatePassword(email, newPassword);
            return ResponseEntity.ok(new UpdateInfoResponse("비밀번호가 성공적으로 변경되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new UpdateInfoResponse("올바른 이메일과 비밀번호를 입력해주세요"));
        }
    }
}





