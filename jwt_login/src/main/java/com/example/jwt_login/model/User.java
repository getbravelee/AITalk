package com.example.jwt_login.model;
import lombok.Data;

@Data
public class User {
    private int id;
    private String username;
    private String password;
}