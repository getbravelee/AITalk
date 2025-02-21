package com.ssafy.aitalk.child.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChildDetailResponse {

    private String centerName;
    private String childName;
    private String protectorNumber;
    private String disabilityType;
    private Integer age;

}
