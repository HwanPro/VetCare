package com.example.back.Model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatCompletionResponse {
    

    private List<Choice> choises;


    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Choice{
        private int index;

        private ChatMessage message;
    }
}
