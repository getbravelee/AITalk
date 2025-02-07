package com.ssafy.aitalk.user.mapper;

import com.ssafy.aitalk.user.entity.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {

    void insertUser(User user);

    User findById(String id);
}
