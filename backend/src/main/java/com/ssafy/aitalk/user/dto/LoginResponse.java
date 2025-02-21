package com.ssafy.aitalk.user.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private Integer therapistId;  // 로그인한 사용자의 therapist_id
    private String token;      // JWT 토큰
}
