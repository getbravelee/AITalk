package com.ssafy.aitalk.user.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import java.util.UUID;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expirationTime;

    // ✅ Base64 디코딩 방식으로 통일
    private byte[] getSigningKey() {
        return Base64.getDecoder().decode(secretKey);
    }

    // ✅ 토큰 생성
    public String generateToken(int therapistId) {

        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);
        Date expiryDate = new Date(nowMillis + expirationTime);

        System.out.println("발급 시간 (issuedAt): " + now);
        System.out.println("만료 시간 (expiration): " + expiryDate);

        return Jwts.builder()
                .setSubject(String.valueOf(therapistId))
                .setId(UUID.randomUUID().toString())           // ✅ 고유한 jti 추가
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(SignatureAlgorithm.HS256, getSigningKey())
                .compact();
    }

    // ✅ 토큰 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(getSigningKey())
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // ✅ Claims 추출
    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(getSigningKey())
                .parseClaimsJws(token)
                .getBody();
    }


    // 토큰에서 ID 추출 (옵션)
    public String extractId(String token) {
        return extractAllClaims(token).getSubject();  // Claims에서 Subject(ID) 추출
    }
}
