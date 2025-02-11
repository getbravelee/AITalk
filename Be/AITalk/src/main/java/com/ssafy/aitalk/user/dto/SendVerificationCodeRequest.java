package com.ssafy.aitalk.user.dto;

import lombok.Data;

@Data
public class SendVerificationCodeRequest {
    private String id;  // 사용자가 입력한 아이디
}
