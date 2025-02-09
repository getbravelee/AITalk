package com.ssafy.aitalk.child.controller;

import com.ssafy.aitalk.child.dto.ChildMessageResponse;
import com.ssafy.aitalk.child.dto.ChildRegisterRequest;
import com.ssafy.aitalk.child.service.ChildService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/child")
public class ChildController {

    @Autowired
    private ChildService childService;


    @PostMapping("/register")
    public ResponseEntity<ChildMessageResponse> registerSchedule(@RequestBody ChildRegisterRequest request){
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            int therapistId = Integer.parseInt(auth.getName());

            childService.registerChild(request,therapistId);

            return ResponseEntity.status(201).body(new ChildMessageResponse("아동 등록 완료"));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(400).body(new ChildMessageResponse(e.getMessage()));
        }
    }


}
