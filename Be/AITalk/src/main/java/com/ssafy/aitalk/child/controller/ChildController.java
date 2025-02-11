package com.ssafy.aitalk.child.controller;

import com.ssafy.aitalk.child.dto.*;
import com.ssafy.aitalk.child.service.ChildService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;


@RestController
@RequestMapping("/child")
public class ChildController {

    @Autowired
    private ChildService childService;


    // 치료 아동 등록
    @PostMapping("/register")
    public ResponseEntity<ChildMessageResponse> registerSchedule(@RequestBody ChildRegisterRequest request, BindingResult bindingResult){

        if(bindingResult.hasErrors()) {
            String errorMessage = Objects.requireNonNull(bindingResult.getFieldError()).getDefaultMessage();
            return ResponseEntity.status(400).body(new ChildMessageResponse("아동 등록 실패 : " + errorMessage));
        }

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

    // 예외 처리 추가
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ChildMessageResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        ChildMessageResponse response = new ChildMessageResponse(ex.getMessage());
        return ResponseEntity.status(400).body(response); // 400 Bad Request 반환
    }

    // 아동 상세 정보
    @GetMapping("/{childId}")
    public ResponseEntity<?> getChildDetail(@PathVariable("childId") int childId) {
        ChildDetailResponse childDetail = childService.getChildDetail(childId);

        return ResponseEntity.status(200).body(childDetail);

    }

    // 해당 아동 일지 전체
    @GetMapping("/{childId}/schedule-list")
    public ResponseEntity<?> getChildScheduleList(@PathVariable("childId") int childId) {
        List<ChildScheduleResponse> childSchedules = childService.getChildSchedule(childId);

        if (childSchedules.isEmpty()) {
            return ResponseEntity.status(404).body("해당 아동의 스케줄이 없습니다.");
        }

        return ResponseEntity.status(200).body(childSchedules);
    }


    // 아동 수정
    @PutMapping("/{childId}")
    public ResponseEntity<?> updateChild(@PathVariable("childId") int childId, @RequestBody ChildUpdateRequest request,  BindingResult bindingResult){

        if(bindingResult.hasErrors()) {
            String errorMessage = Objects.requireNonNull(bindingResult.getFieldError()).getDefaultMessage();
            return ResponseEntity.status(400).body(new ChildMessageResponse("수정 실패 : " + errorMessage));
        }


        try {
            childService.updateChild(childId, request);
            return ResponseEntity.ok(new ChildMessageResponse("아동 수정 완료"));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(400).body(new ChildMessageResponse(e.getMessage()));
        }
    }

    // 아동 삭제
    @DeleteMapping("/{childId}")
    public ResponseEntity<ChildMessageResponse> deleteChild(@PathVariable("childId") int childId) {
        try {
            childService.deleteChild(childId);
            return ResponseEntity.ok(new ChildMessageResponse("아동 삭제 완료"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ChildMessageResponse("존재하지 않는 아동입니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ChildMessageResponse("서버 오류가 발생했습니다."));
        }
    }

}
