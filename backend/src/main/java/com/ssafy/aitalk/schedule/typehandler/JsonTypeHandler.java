package com.ssafy.aitalk.schedule.typehandler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

import java.sql.*;
import java.util.Collections;
import java.util.List;

/**
 * JsonTypeHandler는 MyBatis에서 List<String> 타입을 JSON 문자열로 변환하거나,
 * JSON 문자열을 List<String>으로 역변환하는 역할을 수행합니다.
 *
 * - 데이터베이스에 JSON 형식으로 저장된 문자열을 Java의 List로 변환
 * - Java의 List를 데이터베이스에 JSON 문자열로 저장
 */
public class JsonTypeHandler extends BaseTypeHandler<List<String>> {

    // JSON 파싱과 변환을 위해 ObjectMapper 인스턴스를 사용
    private static final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * List<String> 데이터를 JSON 문자열로 변환하여 PreparedStatement에 설정합니다.
     *
     * @param ps PreparedStatement 객체
     * @param i  파라미터 인덱스
     * @param parameter 변환할 List<String> 데이터
     * @param jdbcType JDBC 데이터 타입
     * @throws SQLException JSON 변환 실패 시 예외 발생
     */
    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, List<String> parameter, JdbcType jdbcType) throws SQLException {
        try {
            // List → JSON 문자열로 변환 후 설정
            ps.setString(i, objectMapper.writeValueAsString(parameter));
        } catch (JsonProcessingException e) {
            throw new SQLException("JSON 변환 실패: " + parameter, e);
        }
    }

    /**
     * ResultSet에서 컬럼명을 기준으로 JSON 문자열을 읽어 List<String>으로 변환합니다.
     *
     * @param rs ResultSet 객체
     * @param columnName 컬럼 이름
     * @return List<String> 데이터
     * @throws SQLException JSON 파싱 오류 발생 시 예외 발생
     */
    @Override
    public List<String> getNullableResult(ResultSet rs, String columnName) throws SQLException {
        return parseJson(rs.getString(columnName));
    }

    /**
     * ResultSet에서 컬럼 인덱스를 기준으로 JSON 문자열을 읽어 List<String>으로 변환합니다.
     *
     * @param rs ResultSet 객체
     * @param columnIndex 컬럼 인덱스
     * @return List<String> 데이터
     * @throws SQLException JSON 파싱 오류 발생 시 예외 발생
     */
    @Override
    public List<String> getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        return parseJson(rs.getString(columnIndex));
    }

    /**
     * CallableStatement에서 컬럼 인덱스를 기준으로 JSON 문자열을 읽어 List<String>으로 변환합니다.
     *
     * @param cs CallableStatement 객체
     * @param columnIndex 컬럼 인덱스
     * @return List<String> 데이터
     * @throws SQLException JSON 파싱 오류 발생 시 예외 발생
     */
    @Override
    public List<String> getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        return parseJson(cs.getString(columnIndex));
    }

    /**
     * JSON 문자열을 List<String>으로 파싱하는 내부 메서드
     *
     * @param json JSON 문자열
     * @return List<String> 데이터
     * @throws SQLException JSON 파싱 오류 발생 시 예외 발생
     */
    private List<String> parseJson(String json) throws SQLException {
        if (json == null || json.trim().isEmpty()) {
            return Collections.emptyList(); // null 또는 빈 문자열인 경우 빈 리스트 반환
        }
        try {
            // JSON 문자열 → List<String> 변환
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            throw new SQLException("JSON 파싱 오류: " + json, e);
        }
    }
}