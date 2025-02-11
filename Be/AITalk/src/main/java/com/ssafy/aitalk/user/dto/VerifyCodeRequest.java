package com.ssafy.aitalk.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyCodeRequest {
    private String id;    // 사용자가 입력한 아이디
    private String code;  // 이메일로 받은 인증코드
}
