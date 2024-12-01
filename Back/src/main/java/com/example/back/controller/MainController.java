package com.example.back.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.example.back.Model.ChatCompletionRequest;
import com.example.back.Model.ChatCompletionResponse;

@RestController
public class MainController {

    @Autowired
    @Qualifier("chatgptRestTemplate")
    RestTemplate chatgptRestTemplate;

    @PostMapping("/hitOpenaiApi")
    public ResponseEntity<String> getOpenaiResponse(@RequestBody String prompt) {
        try {
            ChatCompletionRequest chatCompletionRequest = new ChatCompletionRequest("gpt-3.5-turbo", prompt);

            ChatCompletionResponse response = chatgptRestTemplate.postForObject(
                "https://api.openai.com/v1/chat/completions",
                chatCompletionRequest,
                ChatCompletionResponse.class
            );

            // Acceder al contenido de la respuesta
            String content = response.getChoises().get(0).getMessage().getContent();

            return ResponseEntity.ok(content);
        } catch (HttpClientErrorException.TooManyRequests e) {
            // Captura del error 429 Too Many Requests
            return ResponseEntity.status(429).body("Error: Excediste tu cuota de solicitudes. Verifica tu plan en OpenAI.");
        } catch (HttpClientErrorException e) {
            // Otros errores HTTP
            return ResponseEntity.status(e.getStatusCode()).body("Error al comunicarse con OpenAI: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            // Errores generales
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error interno del servidor: " + e.getMessage());
        }
    }
}
