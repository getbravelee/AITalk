package com.ssafy.aitalk.user.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private int therapistId;  //  int형 유지 (자동으로 Integer로 변환됨)
    private String id;
    private String password;
}
