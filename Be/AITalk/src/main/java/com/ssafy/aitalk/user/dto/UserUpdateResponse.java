package com.ssafy.aitalk.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.Map;

@Data
@AllArgsConstructor
public class UserUpdateResponse {
    private String message;
    private Map<String, Object> updatedFields;  // 변경된 필드 목록
}
