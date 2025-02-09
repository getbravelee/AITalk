package com.ssafy.aitalk.user.service;

import com.ssafy.aitalk.user.dto.*;
import com.ssafy.aitalk.user.entity.User;
import jakarta.validation.Valid;

public interface UserService {
    LoginResponse login(LoginRequest request);

//    void registerUser(RegisterRequest request);
    void registerUser(RegisterRequest request);

    UserResponse getUserInfo(int id);

//    UserResponse updateUserInfo(UserResponse response);

//    void updateUserInfo(User user);

    void updateUserInfo(int id, @Valid UpdateInfoRequest request);

    void deleteUser(int id);

    void sendUserIdByEmail(String email);

    void sendVerificationCode(String id);
    boolean verifyCode(String id, String code);
    void updatePassword(ChangePasswordRequest request);

}
