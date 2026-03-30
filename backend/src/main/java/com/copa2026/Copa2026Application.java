package com.copa2026;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class Copa2026Application {
    public static void main(String[] args) {
        SpringApplication.run(Copa2026Application.class, args);
    }
}