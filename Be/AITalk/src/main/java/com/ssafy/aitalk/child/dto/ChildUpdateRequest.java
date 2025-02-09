package com.ssafy.aitalk.child.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChildUpdateRequest {
    private Integer centerId;
    private String childName;
    private String protectorNumber;
    private String profileImage;
    private String disabilityType;
    private int age;
}
