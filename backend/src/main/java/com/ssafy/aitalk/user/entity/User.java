package com.ssafy.aitalk.user.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private Integer therapistId;
    private String therapistName;
    private String id;         // 사용자 ID
    private String password;   // 암호화된 비밀번호
    private String email;
    private String phoneNumber;


}
