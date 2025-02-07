package com.ssafy.aitalk.schedule.mapper;

import com.ssafy.aitalk.schedule.entity.Schedule;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ScheduleMapper {
    List<Schedule> selectMonthlySchedules(@Param("year") int year, @Param("month") int month);

    String findChildName(@Param("id") int id);
}
