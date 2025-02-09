package com.ssafy.aitalk.child.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChildRegisterRequest {

    private Integer centerId;
    private String childName;
    private String protectorNumber;
    private String profileImage;
    private String disabilityType;
    private int age;

}
