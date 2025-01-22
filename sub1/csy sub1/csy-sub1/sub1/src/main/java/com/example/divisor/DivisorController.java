package com.example.divisor;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class DivisorController {

    @GetMapping("/")
    public String index() {
        return "index"; // index.html 템플릿 반환
    }

    @PostMapping("/button")
    public String button(@RequestParam("inputText") String userInput, Model model) {
        // 사용자 입력값을 정수로 변환
        int inputNumber = Integer.parseInt(userInput);

        // 약수 계산
        StringBuilder divisors = new StringBuilder();
        for (int i = 1; i <= inputNumber; i++) {
            if (inputNumber % i == 0) {
                divisors.append(i).append(" ");
            }
        }

        // 결과를 모델에 추가
        model.addAttribute("userInput", divisors.toString().trim());
        return "index"; // index.html 템플릿 반환
    }
}
