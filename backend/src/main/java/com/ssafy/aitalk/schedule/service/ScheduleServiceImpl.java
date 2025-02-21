package com.ssafy.aitalk.schedule.service;

import com.ssafy.aitalk.schedule.dto.*;
import com.ssafy.aitalk.schedule.entity.Schedule;
import com.ssafy.aitalk.schedule.mapper.ScheduleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Service
public class ScheduleServiceImpl implements ScheduleService {

    @Autowired
    private ScheduleMapper scheduleMapper;

    @Override
    public ArrayList<MonthlyScheduleResponse> getMonthSchedule(int year, int month) {
        List<Schedule> list = scheduleMapper.selectMonthlySchedules(year, month);
        System.out.println(list);
        ArrayList<MonthlyScheduleResponse> responseDTOs = new ArrayList<>();
        for (Schedule schedule : list) {
            String childName = scheduleMapper.findChildName(schedule.getChildId());

            MonthlyScheduleResponse responseDTO = MonthlyScheduleResponse.builder()
                    .treatmentId(schedule.getTreatmentId())
                    .childName(childName)
                    .treatmentDate(schedule.getTreatmentDate().toLocalDate())
                    .startTime(schedule.getStartTime())
                    .endTime(schedule.getEndTime())
                    .build();

            responseDTOs.add(responseDTO);
        }
        return responseDTOs;
    }

    @Override
    public List<DailyScheduleResponse> getDailySchedule(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay(ZoneOffset.UTC).toLocalDateTime();
        List<Schedule> list = scheduleMapper.selectDailySchedules(startOfDay);
        List<DailyScheduleResponse> responseDTOs = new ArrayList<>();
        for (Schedule schedule : list) {
            String childName = scheduleMapper.findChildName(schedule.getChildId());

            DailyScheduleResponse responseDTO = DailyScheduleResponse.builder()
                    .treatmentId(schedule.getTreatmentId())
                    .childName(childName)
                    .startTime(schedule.getStartTime())
                    .endTime(schedule.getEndTime())
                    .build();

            responseDTOs.add(responseDTO);
        }
        return responseDTOs;
    }

    @Override
    public void registerSchedule(ScheduleRegistRequest request, int therapistId) {
        LocalDateTime treatmentDateTime = request.getTreatmentDate().atStartOfDay(ZoneOffset.UTC).toLocalDateTime();

        if (scheduleMapper.isTimeSlotTaken(treatmentDateTime, request.getStartTime(), request.getEndTime()) != null) {
            throw new IllegalStateException("해당 시간은 이미 일정이 있습니다.");
        }

        Schedule schedule = Schedule.builder()
                .therapistId(therapistId)
                .childId(request.getChildId())
                .treatmentDate(treatmentDateTime)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build();

        scheduleMapper.registerSchedule(schedule);
    }

    @Override
    public ScheduleDetailResponse getScheduleDetail(int id) {
        Schedule schedule = scheduleMapper.selectScheduleByScheduleId(id);
        String childName = scheduleMapper.findChildName(schedule.getChildId());
        String centerName = scheduleMapper.findCenterName(schedule.getChildId());

        return ScheduleDetailResponse.builder()
                .childName(childName)
                .treatmentDate(schedule.getTreatmentDate().toLocalDate())
                .startTime(schedule.getStartTime())
                .endTime(schedule.getEndTime())
                .words(schedule.getWords())
                .sentence(schedule.getSentence())
                .conversation(schedule.getConversation())
                .centerName(centerName)
                .build();
    }

    public void updateSchedule(Integer scheduleId, ScheduleUpdateRequest request) {
        LocalDateTime treatmentDateTime = request.getTreatmentDate().atStartOfDay(ZoneOffset.UTC).toLocalDateTime();
        Schedule check = scheduleMapper.isTimeSlotTaken(treatmentDateTime, request.getStartTime(), request.getEndTime());
        if (check != null && !check.getTreatmentId().equals(scheduleId)) {
            throw new IllegalStateException("해당 시간은 이미 일정이 있습니다.");
        }

        Schedule schedule = Schedule.builder()
                .treatmentId(scheduleId)
                .treatmentDate(treatmentDateTime)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .conversation(request.getConversation())
                .build();
        scheduleMapper.updateSchedule(schedule);
    }

    public void deleteSchedule(Integer scheduleId) {
        scheduleMapper.deleteSchedule(scheduleId);
    }
}