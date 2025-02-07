package com.ssafy.aitalk.schedule.service;

import com.ssafy.aitalk.schedule.dto.MonthlyScheduleRequestDTO;
import com.ssafy.aitalk.schedule.dto.MonthlyScheduleResponseDTO;

import java.util.List;

public interface ScheduleService {
    public List<MonthlyScheduleResponseDTO> getMonthSchedule(MonthlyScheduleRequestDTO requestDTO);
}
