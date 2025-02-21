package com.ssafy.aitalk.schedule.service;

import com.ssafy.aitalk.schedule.dto.*;

import java.time.LocalDate;
import java.util.List;

public interface ScheduleService {
    public List<MonthlyScheduleResponse> getMonthSchedule(int year, int month);

    public List<DailyScheduleResponse> getDailySchedule(LocalDate date);

    public void registerSchedule(ScheduleRegistRequest request, int therapistId);

    public ScheduleDetailResponse getScheduleDetail(int id);

    public void updateSchedule(Integer scheduleId, ScheduleUpdateRequest request);

    public void deleteSchedule(Integer scheduleId);


}
