package com.ssafy.aitalk.child.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChildRegisterRequest {

    @NotNull(message = "센터는 필수 입력값입니다.")
    private Integer centerId;

    @NotBlank(message = "이름은 필수 입력값입니다.")
    private String childName;

    @NotBlank(message = "보호자 연락처는 필수 입력값입니다.")
    @Pattern(regexp = "^010-?\\d{4}-?\\d{4}$", message = "전화번호는 010-1234-5678 형식이어야 합니다.")
    private String protectorNumber;

    @NotBlank(message = "장애 유형은 필수 입력값입니다.")
    private String disabilityType;

    @Min(value = 1, message = "나이는 1세 이상이어야 합니다.")
    private int age;

}
