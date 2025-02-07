package com.ssafy.aitalk.user.service;

import com.ssafy.aitalk.user.dto.LoginRequest;
import com.ssafy.aitalk.user.dto.LoginResponse;
import com.ssafy.aitalk.user.entity.User;
import com.ssafy.aitalk.user.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.ssafy.aitalk.user.util.JwtUtil;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

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
    public void registerUser(User user) {
        // 비밀번호 암호화
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 사용자 저장 및 자동 증가된 therapist_id 받기
        userMapper.insertUser(user);

        // 디버깅용: 자동 증가된 therapist_id 출력
        System.out.println("자동 증가된 therapist_id: " + user.getTherapistId());
    }
}
