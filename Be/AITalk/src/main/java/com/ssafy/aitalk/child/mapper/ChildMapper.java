package com.ssafy.aitalk.child.mapper;

import com.ssafy.aitalk.child.entity.Child;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ChildMapper {

    // 치료아동이 이미 존재하는지 확인
    int isRegisteredChild(@Param("protectorNumber") String protectorNumber, @Param("childName") String childName);

    // 치료아동 등록
    void registerChild(Child child);

}
