package com.example.demo.dto.testCreation;

import lombok.Data;

import java.util.List;

@Data
public class QuestionRequest {
    private String type; // "mcq" or "coding"
    private String questionText;
    private List<String> options; // For MCQs
    private Integer correctAnswer; // For MCQs
    private List<TestCase> testCases; // For coding questions
    private Integer marks;

    @Data
    public static class TestCase {
        private String input;
        private String expectedOutput;
    }
}