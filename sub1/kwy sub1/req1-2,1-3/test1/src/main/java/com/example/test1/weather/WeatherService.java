//package com.example.test1.weather;
//
//import java.io.BufferedReader;
//import java.io.InputStreamReader;
//import java.net.HttpURLConnection;
//import java.net.URL;
//import java.time.LocalDateTime;
//import java.time.format.DateTimeFormatter;
//import javax.xml.parsers.DocumentBuilder;
//import javax.xml.parsers.DocumentBuilderFactory;
//import org.w3c.dom.Document;
//import org.w3c.dom.NodeList;
//import org.springframework.stereotype.Service;
//
//@Service
//public class WeatherService {
//
//    private static final String SERVICE_KEY = "CnX8elznzYhj0vNW8UCypXpZJpTY6y5G8UZSfoCPnW3Gx0ZNqsk8fqHSYbFCzSsIThC5QUbmZoTtgyKf0b9yiA%3D%3D";
//    private static final String API_URL = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
//
//    public String getCurrentDateString() {
//        LocalDateTime now = LocalDateTime.now();
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
//        return now.format(formatter);
//    }
//
//    public String getCurrentBaseTime() {
//        LocalDateTime now = LocalDateTime.now();
//        int hour = now.getHour();
//        int minute = now.getMinute();
//
//        // 30분 이전이면 이전 시간의 30분을 기준으로
//        if (minute < 30) {
//            hour = (hour == 0) ? 23 : hour - 1;
//            return (hour < 10 ? "0" : "") + hour + "30";
//        } else {
//            return (hour < 10 ? "0" : "") + hour + "00";
//        }
//    }
//
//    public String getWeatherForecast() {
//        try {
//            StringBuilder urlBuilder = new StringBuilder(API_URL);
//            urlBuilder.append("?serviceKey=").append(SERVICE_KEY)
//                    .append("&pageNo=1")
//                    .append("&numOfRows=1000")
//                    .append("&base_date=").append("20250114")
//                    .append("&base_time=").append("0800")
//                    .append("&nx=55")
//                    .append("&ny=127");
//
//            URL url = new URL(urlBuilder.toString());
//            System.out.println(url);
//            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
//            conn.setRequestMethod("GET");
//            int responseCode = conn.getResponseCode();
//            if (responseCode != HttpURLConnection.HTTP_OK) {
//                System.out.println("Error: " + responseCode);
//                return "Error retrieving weather data.";
//            }
//
//            BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
//            StringBuilder sb = new StringBuilder();
//            String line;
//            while ((line = rd.readLine()) != null) {
//                sb.append(line);
//            }
//            rd.close();
//
//            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
//            DocumentBuilder builder = factory.newDocumentBuilder();
//            Document doc = builder.parse(new java.io.ByteArrayInputStream(sb.toString().getBytes()));
//
//            NodeList items = doc.getElementsByTagName("item");
//            String tmp = null, hum = null, sky = null, sky2 = null;
//
//            for (int i = 0; i < items.getLength(); i++) {
//                String category = items.item(i).getChildNodes().item(0).getTextContent();
//                String value = items.item(i).getChildNodes().item(5).getTextContent();
//
//                switch (category) {
//                    case "T1H":
//                        tmp = value;
//                        break;
//                    case "REH":
//                        hum = value;
//                        break;
//                    case "SKY":
//                        sky = value;
//                        break;
//                    case "PTY":
//                        sky2 = value;
//                        break;
//                }
//            }
//
//            return processWeather(tmp, hum, sky, sky2);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return "Error retrieving weather data.";
//        }
//    }
//
//    private String processWeather(String tmp, String hum, String sky, String sky2) {
//        StringBuilder result = new StringBuilder("서울 날씨 : ");
//
//        if (sky2 != null) {
//            switch (sky2) {
//                case "0":
//                    if (sky != null) {
//                        switch (sky) {
//                            case "1":
//                                result.append("맑음");
//                                break;
//                            case "3":
//                                result.append("구름많음");
//                                break;
//                            case "4":
//                                result.append("흐림");
//                                break;
//                        }
//                    }
//                    break;
//                case "1":
//                    result.append("비");
//                    break;
//                case "2":
//                    result.append("비와 눈");
//                    break;
//                case "3":
//                    result.append("눈");
//                    break;
//                case "5":
//                    result.append("빗방울이 떨어짐");
//                    break;
//                case "6":
//                    result.append("빗방울과 눈이 날림");
//                    break;
//                case "7":
//                    result.append("눈이 날림");
//                    break;
//            }
//            result.append("<br/>");
//        }
//
//        if (tmp != null) {
//            result.append("온도 : ").append(tmp).append("ºC<br/>");
//        }
//
//        if (hum != null) {
//            result.append("습도 : ").append(hum).append("%");
//        }
//
//        return result.toString();
//    }
//}
