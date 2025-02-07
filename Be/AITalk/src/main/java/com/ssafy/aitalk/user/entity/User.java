package com.ssafy.aitalk.user.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Integer therapistId;  // 자동 증가 PK (speech_therapist 테이블)
    private String id;         // 사용자 ID
    private String password;   // 암호화된 비밀번호
    private String token;
}
