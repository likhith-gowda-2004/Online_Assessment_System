package com.example.demo.dto;

public class UserScore {
    private Long userId;
    private Double score;

    // Constructor
    public UserScore(Long userId, Double score) {
        this.userId = userId;
        this.score = score;
    }

    // Getters
    public Long getUserId() {
        return userId;
    }

    public Double getScore() {
        return score;
    }

    // Setters (optional)
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setScore(Double score) {
        this.score = score;
    }
}