package com.ssafy.aitalk.user.service;

import com.ssafy.aitalk.user.dto.LoginRequest;
import com.ssafy.aitalk.user.dto.LoginResponse;
import com.ssafy.aitalk.user.dto.RegisterRequest;
import com.ssafy.aitalk.user.dto.UserResponse;
import com.ssafy.aitalk.user.entity.User;
import com.ssafy.aitalk.user.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.ssafy.aitalk.user.util.JwtUtil;
import java.util.regex.Pattern;

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

}
