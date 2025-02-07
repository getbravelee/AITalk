package com.ssafy.aitalk.schedule.service;

import com.ssafy.aitalk.schedule.dto.MonthlyScheduleRequestDTO;
import com.ssafy.aitalk.schedule.dto.MonthlyScheduleResponseDTO;
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
    public ArrayList<MonthlyScheduleResponseDTO> getMonthSchedule(MonthlyScheduleRequestDTO requestDTO) {
        int year = requestDTO.getYear();
        int month = requestDTO.getMonth();
        List<Schedule> list = scheduleMapper.selectMonthlySchedules(year, month);
        ArrayList<MonthlyScheduleResponseDTO> responseDTOs = new ArrayList<>();
        for (Schedule schedule : list) {
            MonthlyScheduleResponseDTO responseDTO = MonthlyScheduleResponseDTO.builder()
                    .

        }
    }
}
