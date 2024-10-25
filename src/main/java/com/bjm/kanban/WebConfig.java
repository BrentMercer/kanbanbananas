package com.bjm.kanban;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:3000",
                        "http://localhost:8080",
                        "http://44.239.4.189:8080", // My AWS Lightsail static IP - http://44.239.4.189:8080
                        "http://kanbanbananas.com",
                        "http://www.kanbanbananas.com",
                        "https://kanbanbananas.com",
                        "https://www.kanbanbananas.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}