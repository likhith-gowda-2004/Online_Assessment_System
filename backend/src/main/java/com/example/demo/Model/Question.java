package com.example.demo.Model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "questions") // Specify the correct table name
@Data
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "test_id")
    private Test test;

    @Column(name = "type") // Map to the correct column name
    private String type; // "MCQ" or "CODING"

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(columnDefinition = "TEXT")
    private String options; // For MCQs, stored as a semicolon-separated string
    
    private Integer correctAnswer; // For MCQs
    
    @Column(columnDefinition = "TEXT")
    private String testCases; // For coding questions, stored as a semicolon-separated string
    
    @Column(name = "marks") // Map 'marks' field to 'points' column in database
    private Integer marks;
    
    // No need to add explicit getters and setters thanks to Lombok @Data
}