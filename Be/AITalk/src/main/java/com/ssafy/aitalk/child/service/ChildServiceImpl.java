package com.ssafy.aitalk.child.service;

import com.ssafy.aitalk.child.dto.ChildDetailResponse;
import com.ssafy.aitalk.child.dto.ChildRegisterRequest;
import com.ssafy.aitalk.child.dto.ChildScheduleResponse;
import com.ssafy.aitalk.child.dto.ChildrenListResponse;
import com.ssafy.aitalk.child.entity.Child;
import com.ssafy.aitalk.child.mapper.ChildMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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

    // 아동 리스트 불러오기
    @Override
    public List<ChildrenListResponse> getChildrenList(int therapistId, String childName) {
        List<ChildrenListResponse> childList;

        if (childName != null && !childName.trim().isEmpty()) {
            childList = childMapper.findChildByName(therapistId, childName);

            if (childList.isEmpty()) {
                // ✅ 검색 결과가 없으면 예외 발생
                throw new IllegalArgumentException("해당하는 아동이 없습니다.");
            }
        } else {
            childList = childMapper.findAllChildren(therapistId);
        }

        return childList;
    }

    // 아동 상세 보기
    @Override
    public ChildDetailResponse getChildDetail(int childId) {
        return childMapper.findChildById(childId);
    }

    // 해당 아동 일지 전체
    @Override
    public List<ChildScheduleResponse> getChildSchedule(int childId) {
        return childMapper.findChildScheduleById(childId);
    }
}
