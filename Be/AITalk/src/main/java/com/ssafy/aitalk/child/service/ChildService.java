package com.ssafy.aitalk.child.service;

import com.ssafy.aitalk.child.dto.ChildRegisterRequest;

public interface ChildService {

    // 치료 아동 등록
    public void registerChild(ChildRegisterRequest request, int therapistId);



}
