# 1. JDK 17 기반 이미지 사용 (빌드용)
FROM eclipse-temurin:17-jdk as builder

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 프로젝트 파일 복사
COPY . .

# 4. 실행 권한 추가 (chmod +x gradlew)
RUN chmod +x ./gradlew

# 5. Gradle 빌드 실행 (JAR 파일 생성)
RUN ./gradlew clean build -x test

# 6. 실행 환경 설정 (JDK 17)
FROM eclipse-temurin:17-jdk as runtime
WORKDIR /app

# 7. 빌드된 JAR 파일 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# 8. 컨테이너 실행 시 JAR 실행
CMD ["java", "-jar", "app.jar"]
