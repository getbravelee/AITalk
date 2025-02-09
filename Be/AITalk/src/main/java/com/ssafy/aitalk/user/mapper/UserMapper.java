package com.ssafy.aitalk.user.mapper;

import com.ssafy.aitalk.user.entity.User;
import org.apache.ibatis.annotations.*;

@Mapper
public interface UserMapper {

    void insertUser(User user);

    User findById(@Param("id") String id);

    int countById(@Param("id") String id);  // 아이디 중복 확인

    int countByEmail(@Param("email") String email);  // 이메일 중복 확인

    User findInfoById(@Param("id") int id); // name으로 로그인한 사용자 찾기

    void updateUserInfo(@Param("id") int id,
                        @Param("email") String email,
                        @Param("phoneNumber") String phoneNumber);

    void deleteUser(@Param("id") int id);

    String findIdByEmail(@Param("email") String email);  // 아이디 찾기


    String findEmailById(@Param("id") String id);

//    @Update("UPDATE speech_therapist SET password = #{password} WHERE id = #{id}")
    int updatePasswordById(@Param("id") String id, @Param("password") String password);


}
