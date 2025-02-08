package com.ssafy.aitalk.schedule.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleDetailResponse {
    private String childName;
    private LocalDate treatmentDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private List<String> words;
    private List<String> sentence;
    private String conversation;
}
