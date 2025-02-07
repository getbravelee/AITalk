package com.ssafy.aitalk.user.service;

import com.ssafy.aitalk.user.dto.LoginRequest;
import com.ssafy.aitalk.user.dto.LoginResponse;
import com.ssafy.aitalk.user.entity.User;

public interface UserService {
    LoginResponse login(LoginRequest request);

    void registerUser(User user);

}
