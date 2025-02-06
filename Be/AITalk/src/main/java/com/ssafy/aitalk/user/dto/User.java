package com.ssafy.aitalk.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class User {
    private Integer therapistId;  // 자동 증가 PK (speech_therapist 테이블)
    private String id;         // 사용자 ID
    private String password;   // 암호화된 비밀번호
}
