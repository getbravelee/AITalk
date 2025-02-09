package com.ssafy.aitalk.user.dto;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Getter
@Setter
public class ChangePasswordRequest {
    @NotBlank(message = "아이디를 입력해야 합니다.")
    private String id;

    @NotBlank(message = "비밀번호를 입력해야 합니다.")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$",
            message = "비밀번호는 영문, 숫자, 특수문자를 포함하여 8~20자로 입력해야 합니다.")
    private String password;


    @NotBlank(message = "비밀번호 확인을 입력해야 합니다.")
    private String confirmPassword;
}
