package com.ssafy.aitalk.schedule.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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
public class ScheduleRegistRequest {

    private Integer childId;

    private LocalDate treatmentDate;

    private LocalTime startTime;
    private LocalTime endTime;
}
