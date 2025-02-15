package com.ssafy.aitalk.child.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Center {
    private int centerId;
    private String centerName;
    private String centerNumber;
    private String centerAddress;
}
