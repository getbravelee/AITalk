//package com.example.test1.weather;
//
//import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
//import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
//import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
//
//@JsonIgnoreProperties(ignoreUnknown = true)
//@JacksonXmlRootElement(localName = "item") // XML root element 이름
//public class Item {
//    @JacksonXmlProperty(localName = "name") // XML element 이름
//    private String name;
//    @JacksonXmlProperty(localName = "value")
//    private String value;
//
//
//    @JacksonXmlProperty(localName = "header")
//    private String header;
//    // getter, setter 생략
//}