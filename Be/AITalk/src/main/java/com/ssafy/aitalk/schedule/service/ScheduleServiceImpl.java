package com.ssafy.aitalk.schedule.service;

import com.ssafy.aitalk.schedule.dto.MonthlyScheduleResponse;
import com.ssafy.aitalk.schedule.entity.Schedule;
import com.ssafy.aitalk.schedule.mapper.ScheduleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ScheduleServiceImpl implements ScheduleService {

    @Autowired
    private ScheduleMapper scheduleMapper;

    @Override
    public ArrayList<MonthlyScheduleResponse> getMonthSchedule(int year,int month) {
        List<Schedule> list = scheduleMapper.selectMonthlySchedules(year, month);
        ArrayList<MonthlyScheduleResponse> responseDTOs = new ArrayList<>();
        for (Schedule schedule : list) {
            String childName = scheduleMapper.findChildName(schedule.getChildId());

            MonthlyScheduleResponse responseDTO = MonthlyScheduleResponse.builder()
                    .treatmentId(schedule.getTreatmentId())
                    .childName(childName)
                    .treatmentDate(schedule.getTreatmentDate())
                    .startTime(schedule.getStartTime())
                    .endTime(schedule.getEndTime())
                    .build();

            responseDTOs.add(responseDTO);
        }
        return responseDTOs;
    }
}
