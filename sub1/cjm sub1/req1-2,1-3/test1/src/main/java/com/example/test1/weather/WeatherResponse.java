//package com.example.test1.weather;
//
//import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
//import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
//import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
//
//import java.util.List;
//
//
//@JacksonXmlRootElement(localName = "response")  // 최상위 요소 'response'를 처리
//public class WeatherResponse {
//
//    @JacksonXmlProperty(localName = "header")
//    private Header header;
//
//    @JacksonXmlProperty(localName = "body")
//    private Body body;
//
//    public Header getHeader() {
//        return header;
//    }
//
//    public Body getBody() {
//        return body;
//    }
//
//    @JacksonXmlRootElement(localName = "header")
//    public static class Header {
//        @JacksonXmlProperty(localName = "resultCode")
//        private String resultCode;
//
//        @JacksonXmlProperty(localName = "resultMsg")
//        private String resultMsg;
//
//        public String getResultCode() {
//            return resultCode;
//        }
//
//        public String getResultMsg() {
//            return resultMsg;
//        }
//    }
//
//    @JsonIgnoreProperties(ignoreUnknown = true)  // 알려지지 않은 속성 무시
//    @JacksonXmlRootElement(localName = "body")
//    public static class Body {
//        @JacksonXmlProperty(localName = "items")
//        private Items items;
//
//        public Items getItems() {
//            return items;
//        }
//    }
//
//    @JacksonXmlRootElement(localName = "items")
//    public static class Items {
//        @JacksonXmlProperty(localName = "item")
//        private List<Item> itemList;
//
//        public List<Item> getItemList() {
//            return itemList;
//        }
//    }
//
//    @JacksonXmlRootElement(localName = "item")
//    public static class Item {
//        @JacksonXmlProperty(localName = "baseDate")
//        private String baseDate;
//
//        @JacksonXmlProperty(localName = "baseTime")
//        private String baseTime;
//
//        @JacksonXmlProperty(localName = "category")
//        private String category;
//
//        @JacksonXmlProperty(localName = "nx")
//        private String nx;
//
//        @JacksonXmlProperty(localName = "ny")
//        private String ny;
//
//        @JacksonXmlProperty(localName = "obsrValue")
//        private String obsrValue;
//
//        public String getBaseDate() {
//            return baseDate;
//        }
//
//        public String getBaseTime() {
//            return baseTime;
//        }
//
//        public String getCategory() {
//            return category;
//        }
//
//        public String getNx() {
//            return nx;
//        }
//
//        public String getNy() {
//            return ny;
//        }
//
//        public String getObsrValue() {
//            return obsrValue;
//        }
//    }
//}
