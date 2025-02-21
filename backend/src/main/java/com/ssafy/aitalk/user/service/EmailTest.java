package com.ssafy.aitalk.user.service;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class EmailTest implements CommandLineRunner {

    @Autowired
    private EmailService emailService;

    @Override
    public void run(String... args) throws MessagingException {
        emailService.sendEmail("kimtest7001@gmail.com", "테스트 이메일", "이메일 설정이 정상적으로 동작합니다.");
        System.out.println("✅ 이메일이 성공적으로 전송되었습니다.");
    }
}
