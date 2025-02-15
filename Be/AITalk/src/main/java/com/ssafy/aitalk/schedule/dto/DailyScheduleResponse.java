package com.ssafy.aitalk.schedule.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyScheduleResponse {
    private Integer treatmentId;
    private String childName;
    private LocalTime startTime;
    private LocalTime endTime;
}
