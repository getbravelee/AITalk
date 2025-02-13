package com.ssafy.aitalk.child.service;

import com.ssafy.aitalk.child.dto.*;

import java.util.List;

public interface ChildService {

    // 치료 아동 등록
    void registerChild(ChildRegisterRequest request, int therapistId);

    // 아동 리스트 불러오기
    List<ChildrenListResponse> getChildrenList(int therapistId, String childName);

    // 아동 상세 보기
    ChildDetailResponse getChildDetail(int childId);

    // 해당 아동 일지 전체
    List<ChildScheduleResponse> getChildSchedule(int childId);

    // 아동 수정
    void updateChild(Integer childId, ChildUpdateRequest request);

    // 아동 삭제
    void deleteChild(Integer childId);


}
