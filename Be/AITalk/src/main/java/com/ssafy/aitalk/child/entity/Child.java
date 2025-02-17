package com.ssafy.aitalk.child.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Child {
    private Integer childId;
    private Integer therapistId;
    private Integer centerId;
    private String childName;
    private String protectorNumber;
    private String disabilityType;
    private Integer age;
}
