package com.ssafy.aitalk.schedule.service;

import com.ssafy.aitalk.schedule.dto.MonthlyScheduleResponse;

import java.util.List;

public interface ScheduleService {
    public List<MonthlyScheduleResponse> getMonthSchedule(int year, int month);
}
