package com.ssafy.aitalk.child.service;

import com.ssafy.aitalk.child.dto.ChildRegisterRequest;
import com.ssafy.aitalk.child.dto.ChildrenListResponse;

import java.util.List;

public interface ChildService {

    // 치료 아동 등록
    public void registerChild(ChildRegisterRequest request, int therapistId);

    // 아동 리스트 불러오기
    public List<ChildrenListResponse> getChildrenList(int therapistId, String childName);


}
