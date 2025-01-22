package com.example.test1.weather;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.client.RestTemplate;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.w3c.dom.*;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;

@Controller
public class WeatherController {

    @Value("${weather.api.url}")
    private String apiUrl;

    @Value("${weather.api.key}")
    private String apiKey;

    @GetMapping("/")
    public String getWeatherData(Model model) {
        String url = apiUrl + "?serviceKey=" + apiKey + "&pageNo=1&numOfRows=1000&dataType=JSON&base_date=20250114&base_time=0800&nx=55&ny=127";
        System.out.println(url);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);


        String jsonData = response.getBody(); // 실제 XML 데이터 입력

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        List<WeatherData> weatherDataList = new ArrayList<>();
        try {
            JsonNode jsonNode = objectMapper.readTree(jsonData);
            JsonNode items = jsonNode.path("response").path("body").path("items").path("item");

            if (items.isArray()) {
                for (JsonNode item : items) {
                    WeatherData weatherData = objectMapper.convertValue(item, WeatherData.class);
                    weatherDataList.add(weatherData);
                }
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace(); //예외처리
        }
        WatchData watchData = new WatchData();
        for(int i = 0; i < weatherDataList.size(); i+= 6){
            if(weatherDataList.get(i).getCategory().equals("T1H")){
                watchData.setOne(weatherDataList.get(i).getFcstValue());
            }else if(weatherDataList.get(i).getCategory().equals("SKY")){
                if(weatherDataList.get(i).getFcstValue().equals("1")){
                    watchData.setTwo("맑음");
                } else if(weatherDataList.get(i).getFcstValue().equals("3")){
                    watchData.setTwo("구름많음");
                } else {
                    watchData.setTwo("흐림");
                }
            }else if(weatherDataList.get(i).getCategory().equals("REH")){
                watchData.setThree(weatherDataList.get(i).getFcstValue());
            }
        }

        model.addAttribute("watchData", watchData);
        return "weather";
    }


}