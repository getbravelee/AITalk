package com.ssafy.aitalk.schedule.controller;

import com.ssafy.aitalk.schedule.dto.MonthlyScheduleResponse;
import com.ssafy.aitalk.schedule.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/schedule")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @GetMapping("/{year}/{month}")
    public ResponseEntity<List<MonthlyScheduleResponse>> list(@PathVariable int year, @PathVariable int month) {

        List<MonthlyScheduleResponse> list = scheduleService.getMonthSchedule(year,month);

        return ResponseEntity.status(200).body(list);
    }


}
