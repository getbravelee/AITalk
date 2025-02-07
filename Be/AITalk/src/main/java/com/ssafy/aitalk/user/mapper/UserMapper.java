package com.ssafy.aitalk.user.mapper;

import com.ssafy.aitalk.user.entity.User;
import org.apache.ibatis.annotations.*;

@Mapper
public interface UserMapper {

    void insertUser(User user);

    User findById(@Param("id") String id);

    int countById(@Param("id") String id);  // 아이디 중복 확인

    int countByEmail(@Param("email") String email);  // 이메일 중복 확인
}
