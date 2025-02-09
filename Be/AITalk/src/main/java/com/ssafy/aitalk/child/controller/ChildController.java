package com.ssafy.aitalk.child.controller;

import com.ssafy.aitalk.child.dto.ChildMessageResponse;
import com.ssafy.aitalk.child.dto.ChildRegisterRequest;
import com.ssafy.aitalk.child.dto.ChildrenListResponse;
import com.ssafy.aitalk.child.service.ChildService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/child")
public class ChildController {

    @Autowired
    private ChildService childService;


    // 치료 아동 등록
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

    // 아동 리스트 가져오기
    @GetMapping("/list")
    public ResponseEntity<?> getChildList(
            @RequestHeader("Authorization") String token,
            @RequestParam(required = false) String childName
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        int therapistId = Integer.parseInt(auth.getName());

        List<ChildrenListResponse> childList = childService.getChildrenList(therapistId, childName);

        return ResponseEntity.status(200).body(childList);
    }

    // ✅ 예외 처리 추가
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ChildMessageResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        ChildMessageResponse response = new ChildMessageResponse(ex.getMessage());
        return ResponseEntity.status(400).body(response); // 400 Bad Request 반환
    }
}
