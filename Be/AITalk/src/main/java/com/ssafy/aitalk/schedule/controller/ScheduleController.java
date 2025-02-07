package com.ssafy.aitalk.schedule.controller;

import com.ssafy.aitalk.schedule.dto.MonthlyScheduleResponseDTO;
import com.ssafy.aitalk.schedule.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/schedule")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @GetMapping("/list")
    public ResponseEntity<?> list() {
        List<MonthlyScheduleResponseDTO> list = scheduleService
    }


}
