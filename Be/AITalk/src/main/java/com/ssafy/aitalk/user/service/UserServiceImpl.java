package com.ssafy.aitalk.user.service;

import com.ssafy.aitalk.user.dto.User;
import com.ssafy.aitalk.user.mapper.UserMapper;
import com.ssafy.aitalk.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
