package com.ssafy.aitalk.child.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CenterListResponse {
    private int centerId;
    private String centerName;
    private String centerNumber;
    private String centerAddress;
}
