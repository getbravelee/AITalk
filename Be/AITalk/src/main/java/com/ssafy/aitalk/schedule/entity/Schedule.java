package com.ssafy.aitalk.schedule.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Schedule {
    private Integer treatmentId;
    private Integer therapistId;
    private Integer childId;
    private LocalDateTime treatmentDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private List<String> words;
    private List<String> sentence;
    private String conversation;
}
