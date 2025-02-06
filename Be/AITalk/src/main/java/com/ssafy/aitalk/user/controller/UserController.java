package com.ssafy.aitalk.user.controller;

import com.ssafy.aitalk.user.dto.User;
import com.ssafy.aitalk.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public String registerUser(@RequestBody User user) {
        userService.registerUser(user);
        return "회원가입이 완료되었습니다. therapist_id: " + user.getTherapistId();
    }
}
