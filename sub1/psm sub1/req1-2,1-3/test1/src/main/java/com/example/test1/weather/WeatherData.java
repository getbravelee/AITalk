package com.example.test1.weather;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class WeatherData {
    @JsonProperty("baseDate")
    private String baseDate;
    @JsonProperty("baseTime")
    private String baseTime;
    @JsonProperty("category")
    private String category;
    @JsonProperty("fcstTime")
    private String fcstTime;
    @JsonProperty("fcstValue")
    private String fcstValue;

    // 필요한 다른 필드 추가
}