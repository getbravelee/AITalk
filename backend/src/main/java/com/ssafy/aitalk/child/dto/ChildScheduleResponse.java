package com.ssafy.aitalk.child.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChildScheduleResponse {
    private int treatmentId;
    private LocalDate treatmentDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private List<String> words;
    private List<String> sentence;
    private String conversation;
}
