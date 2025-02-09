package com.ssafy.aitalk.child.service;

import com.ssafy.aitalk.child.dto.ChildRegisterRequest;
import com.ssafy.aitalk.child.entity.Child;
import com.ssafy.aitalk.schedule.entity.Schedule;
import com.ssafy.aitalk.child.mapper.ChildMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChildServiceImpl implements ChildService {

    @Autowired
    private ChildMapper childMapper;

    // 치료 아동 등록하기
    public void registerChild(ChildRegisterRequest request, int therapistId) {
        if (childMapper.isRegisteredChild(request.getProtectorNumber(), request.getChildName()) > 0) {
            throw new IllegalStateException("이미 아동이 존재합니다.");
        }

        Child child = Child.builder()
                .therapistId(therapistId)
                .centerId(request.getCenterId())
                .childName(request.getChildName())
                .protectorNumber(request.getProtectorNumber())
                .profileImage(request.getProfileImage())
                .disabilityType(request.getDisabilityType())
                .age(request.getAge())
                .build();

        childMapper.registerChild(child);
    }

}
