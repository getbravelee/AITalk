package com.ssafy.aitalk.schedule.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyScheduleResponse {
    private Integer treatmentId;
    private String childName;
    private LocalDate treatmentDate;
    private LocalTime startTime;
    private LocalTime endTime;
}
