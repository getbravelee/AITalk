package com.ssafy.aitalk.user.mapper;

import com.ssafy.aitalk.user.dto.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {

    @Insert("INSERT INTO speech_therapist (id, password) VALUES (#{id}, #{password})")
    @Options(useGeneratedKeys = true, keyProperty = "therapistId")  // 자동 증가된 therapistId 반환
    void insertUser(User user);

    @Select("SELECT * FROM speech_therapist WHERE id = #{id}")
    User findById(String id);
}
