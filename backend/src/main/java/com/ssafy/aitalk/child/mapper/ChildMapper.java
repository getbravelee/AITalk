package com.ssafy.aitalk.child.mapper;

import com.ssafy.aitalk.child.dto.ChildDetailResponse;
import com.ssafy.aitalk.child.dto.ChildScheduleResponse;
import com.ssafy.aitalk.child.dto.ChildrenListResponse;
import com.ssafy.aitalk.child.entity.Center;
import com.ssafy.aitalk.child.entity.Child;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ChildMapper {

    // 치료아동이 이미 존재하는지 확인
    int isRegisteredChild(@Param("protectorNumber") String protectorNumber, @Param("childName") String childName);

    // 치료아동 등록
    void registerChild(Child child);

    // 특정 아동 조회
    List<ChildrenListResponse> findChildByName(@Param("therapistId") int therapistId, @Param("childName") String childName);

    // 전체 아동 조회
    List<ChildrenListResponse> findAllChildren(@Param("therapistId") int therapistId);

    // 아동 상세보기
    ChildDetailResponse findChildById(int childId);

    // 해당 아동 일지 전체
    List<ChildScheduleResponse> findChildScheduleById(int childId);

    // 아동 정보 수정
    void updateChild(@Param("child") Child child);


    // 아동 삭제
    void deleteChild(int childId);

    // 일지 삭제
    void deleteTreatmentsByChildId(Integer childId);

    List<Center> findCenter();
}
