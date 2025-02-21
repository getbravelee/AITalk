package com.ssafy.aitalk.user.util;

import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.HashSet;

@Component
public class EmailVerificationStorage {
    private final Map<String, String> verificationCodes = new HashMap<>();
    private final Map<String, Long> expirationTimes = new HashMap<>();
    private final Set<String> verifiedUsers = new HashSet<>();

    // 인증코드 저장 (5분 후 만료)
    public void saveVerificationCode(String email, String code) {
        verificationCodes.put(email, code);
        expirationTimes.put(email, System.currentTimeMillis() + (5 * 60 * 1000)); // 5분 후 만료

        System.out.println("저장된 인증 코드: " + verificationCodes.get(email));

    }

    // 인증코드 검증
    public boolean verifyCode(String email, String code) {
        if (!verificationCodes.containsKey(email)) {
            return false;
        }
        if (System.currentTimeMillis() > expirationTimes.get(email)) {
            verificationCodes.remove(email);
            expirationTimes.remove(email);
            return false; // 만료된 코드
        }
        if (verificationCodes.get(email).equals(code)) {
            verificationCodes.remove(email);
            expirationTimes.remove(email);
            verifiedUsers.add(email); // 인증 완료된 이메일 저장
            return true;
        }
        return false;
    }

    // 이메일 인증 여부 확인
    public boolean isEmailVerified(String email) {
        return verifiedUsers.contains(email);
    }

    // 인증된 이메일 제거 (회원가입/비밀번호 변경 완료 후)
    public void removeVerifiedEmail(String email) {
        verifiedUsers.remove(email);
    }
}
