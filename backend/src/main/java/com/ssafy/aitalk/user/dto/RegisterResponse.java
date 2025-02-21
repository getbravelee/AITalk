package com.ssafy.aitalk.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // getter, setter, tostring 생성해줌
@NoArgsConstructor // 매개변수가 없는 생성자
@AllArgsConstructor // 모든 변수가 매개변수로 들어있는 생성자
@Builder // 빌더 패턴에 이용
public class RegisterResponse {
    private String message;
}
