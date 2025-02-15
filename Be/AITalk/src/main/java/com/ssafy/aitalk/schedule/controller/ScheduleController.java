package com.ssafy.aitalk.schedule.controller;

import com.ssafy.aitalk.schedule.dto.*;
import com.ssafy.aitalk.schedule.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/schedule")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @GetMapping("list/{year}/{month}")
    public ResponseEntity<List<MonthlyScheduleResponse>> getMonthSchedule(@PathVariable int year, @PathVariable int month) {

        List<MonthlyScheduleResponse> list = scheduleService.getMonthSchedule(year,month);

        return ResponseEntity.status(200).body(list);
    }

    @GetMapping("list/{date}")
    public ResponseEntity<List<DailyScheduleResponse>> getDailySchedule(@PathVariable LocalDate date) {

        List<DailyScheduleResponse> list = scheduleService.getDailySchedule(date);

        return ResponseEntity.status(200).body(list);
    }

    @GetMapping("/detail/{schedule-id}")
    public ResponseEntity<ScheduleDetailResponse> getScheduleDetail(@PathVariable("schedule-id") Integer scheduleId) {
        ScheduleDetailResponse scheduleDetail = scheduleService.getScheduleDetail(scheduleId);

        return ResponseEntity.status(200).body(scheduleDetail);
    }

    @PutMapping("/detail/{scheduleId}")
    public ResponseEntity<ScheduleMessageResponse> updateSchedule(@PathVariable Integer scheduleId, @RequestBody ScheduleUpdateRequest request) {
        try {
            scheduleService.updateSchedule(scheduleId, request);
            return ResponseEntity.ok(new ScheduleMessageResponse("수정완료"));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(400).body(new ScheduleMessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/detail/{scheduleId}")
    public ResponseEntity<ScheduleMessageResponse> deleteSchedule(@PathVariable Integer scheduleId) {
        scheduleService.deleteSchedule(scheduleId);
        return ResponseEntity.ok(new ScheduleMessageResponse("삭제완료"));
    }

    @PostMapping("/register")
    public ResponseEntity<ScheduleMessageResponse> registerSchedule(@RequestBody ScheduleRegistRequest request){
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            int therapistId = Integer.parseInt(auth.getName());
            scheduleService.registerSchedule(request,therapistId);
            return ResponseEntity.status(201).body(new ScheduleMessageResponse("등록 완료"));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(400).body(new ScheduleMessageResponse(e.getMessage()));
        }
    }



}
