package com.example.demo.Model;

import jakarta.persistence.*;

@Entity
public class TestResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private Double score;

    // Getters and setters
}