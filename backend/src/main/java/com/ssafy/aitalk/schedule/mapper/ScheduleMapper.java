package com.ssafy.aitalk.schedule.mapper;

import com.ssafy.aitalk.schedule.entity.Schedule;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Mapper
public interface ScheduleMapper {
    List<Schedule> selectMonthlySchedules(@Param("year") int year, @Param("month") int month);

    List<Schedule> selectDailySchedules(@Param("date") LocalDateTime date);

    Schedule selectScheduleByScheduleId(@Param("id") int id);

    void registerSchedule(Schedule schedule);

    String findChildName(@Param("id") int id);

    String findCenterName(@Param("id") int id);

    Integer findChildId(@Param("name") String name);

    Schedule isTimeSlotTaken(LocalDateTime date, LocalTime startTime, LocalTime endTime);

    void updateSchedule(Schedule schedule);

    void deleteSchedule(Integer scheduleId);
}