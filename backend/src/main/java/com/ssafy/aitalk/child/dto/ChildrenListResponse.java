package com.ssafy.aitalk.child.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChildrenListResponse {
    private Integer childId;
    private String childName;
    private String protectorNumber;
    private Integer age;
    private String disabilityType;
    private String centerName;
}
