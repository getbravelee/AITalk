package com.ssafy.aitalk.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordRequest {
    private String id;         // 사용자가 입력한 아이디
    private String password;   // 변경할 새로운 비밀번호
}
