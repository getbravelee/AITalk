package com.ssafy.aitalk.user.service;

import com.ssafy.aitalk.user.dto.*;
import com.ssafy.aitalk.user.entity.User;
import com.ssafy.aitalk.user.mapper.UserMapper;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.ssafy.aitalk.user.util.JwtUtil;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.regex.Pattern;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userMapper.findById(request.getId());

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // JWT 토큰 생성
        String token = jwtUtil.generateToken(user.getTherapistId());

        // therapist_id와 JWT 토큰 반환
        return new LoginResponse(user.getTherapistId(), token);
    }

    @Override
    public void registerUser(RegisterRequest request) {
        // 아이디 중복 확인
        if (userMapper.countById(request.getId()) > 0) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }

        // 이메일 중복 확인
        if (userMapper.countByEmail(request.getEmail()) > 0) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        // 비밀번호 확인
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        }

        // 비밀번호 유효성 검사
        String passwordPattern = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,20}$";
        if (!Pattern.matches(passwordPattern, request.getPassword())) {
            throw new IllegalArgumentException("비밀번호는 영문, 숫자, 특수문자를 포함하여 8~20자로 입력해야 합니다.");
        }

        // 전화번호 유효성 검사
        String phonePattern = "^010-?\\d{4}-?\\d{4}$";
        if (!Pattern.matches(phonePattern, request.getPhoneNumber())) {
            throw new IllegalArgumentException("전화번호는 010-xxxx-xxxx 또는 010xxxxxxxx 형식으로 입력해야 합니다.");
        }

        // 비밀번호 암호화 후 저장
        User user = new User();
        user.setId(request.getId());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setTherapistName(request.getName());


        userMapper.insertUser(user);

    }

    // 🔹 현재 로그인한 사용자 정보 가져오기
    @Override
    public UserResponse getUserInfo(int id) {
        User user = userMapper.findInfoById(id);
        System.out.println(user);
        if (user == null) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다.");
        }

        // 🔹 User 객체에서 필요한 정보만 추출하여 UserResponse 생성
        return new UserResponse(
                user.getId(),
                user.getTherapistName(),
                user.getEmail(),
                user.getPhoneNumber()
        );
    }


    @Override
    public void updateUserInfo(int id, @Valid UpdateInfoRequest request) {
        // 사용자 정보 조회
        User user = userMapper.findInfoById(id);
        if (user == null) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다.");
        }

        // 사용자 정보 업데이트
        userMapper.updateUserInfo(id, request.getEmail(), request.getPhoneNumber());
    }

    @Override
    public void deleteUser(int id) {
        User user = userMapper.findInfoById(id);
        if (user == null) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다.");
        }

        // 회원 탈퇴 (데이터 삭제)
        userMapper.deleteUser(id);
    }


    @Override
    public void sendUserIdByEmail(String email) {
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("올바른 이메일 주소를 입력해주세요");
        }

        String userId = userMapper.findIdByEmail(email);
        if (userId == null) {
            throw new UsernameNotFoundException("해당 이메일을 사용하는 계정을 찾을 수 없습니다.");
        }

        // 이메일 전송
        try {
            emailService.sendEmail(email, "아이디 찾기", "회원님의 아이디는: " + userId + " 입니다.");
        } catch (MessagingException e) {
            throw new RuntimeException("이메일 전송 실패");
        }
    }

    // 인증코드 저장용 (DB 대신 임시 메모리 사용)
    private Map<String, String> verificationCodes = new HashMap<>();

    @Override
    public void sendVerificationCode(String id) {
        String email = userMapper.findEmailById(id);  // 아이디를 통해 이메일 조회
        if (email == null) {
            throw new IllegalArgumentException("해당 아이디를 사용하는 계정을 찾을 수 없습니다.");
        }

        // 6자리 랜덤 인증코드 생성
        String verificationCode = String.format("%06d", new Random().nextInt(999999));
        verificationCodes.put(id, verificationCode); // 아이디-코드 매핑

        // 이메일 발송
        try {
            emailService.sendEmail(email, "비밀번호 변경 인증코드", "인증코드: " + verificationCode);
        } catch (MessagingException e) {
            throw new RuntimeException("이메일 전송 실패");
        }
    }

    @Override
    public boolean verifyCode(String id, String code) {
        if (verificationCodes.containsKey(id) && verificationCodes.get(id).equals(code)) {
            verificationCodes.remove(id); // 인증 성공 시 코드 삭제
            return true;
        }
        return false;
    }

    @Override
    public void updatePassword(String id, String newPassword) {
        if (newPassword.length() < 8) {
            throw new IllegalArgumentException("비밀번호는 8자 이상이어야 합니다.");
        }

        String encryptedPassword = passwordEncoder.encode(newPassword);
        userMapper.updatePasswordById(id, encryptedPassword);
    }

}
