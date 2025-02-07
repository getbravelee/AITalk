package com.ssafy.aitalk.schedule.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyScheduleRequestDTO {
    private int year;   // 연도
    private int month;  // 월
}
