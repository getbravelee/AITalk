package com.ssafy.aitalk.user.security;

import com.ssafy.aitalk.user.util.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthorizationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // 1. Authorization 헤더에서 JWT 토큰 추출
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);

            if (jwtUtil.validateToken(token)) { // 토큰 유효성 검증
                String userId = jwtUtil.extractId(token); // 토큰에서 사용자 정보 추출 - 사용자의 아이디 (pk 아님)


                // 2. 인증 정보 생성
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(userId, null, null);

                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 3. SecurityContext에 인증 정보 저장
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }

        // 4. 다음 필터로 요청 전달
        filterChain.doFilter(request, response);
    }
}
