package com.ssafy.aitalk.user.service;

import com.ssafy.aitalk.user.dto.*;
import jakarta.validation.Valid;

public interface UserService {
    LoginResponse login(LoginRequest request);

//    void registerUser(RegisterRequest request);
    void registerUser(RegisterRequest request);

    UserResponse getUserInfo(int id);

//    UserResponse updateUserInfo(UserResponse response);

//    void updateUserInfo(User user);

    UserUpdateResponse updateUserInfo(int id, @Valid UpdateInfoRequest request);

    void deleteUser(int id);

    void sendUserIdByEmail(String email);

    void sendVerificationCode(String id);
    boolean verifyCode(String id, String code);
    void updatePassword(ChangePasswordRequest request);

    void changePassword(int id, String newPassword);

    void sendEmailVerification(String email); // 이메일 인증 코드 전송
    boolean verifyEmail(String email, String code); // 이메일 인증 코드 확인
}
