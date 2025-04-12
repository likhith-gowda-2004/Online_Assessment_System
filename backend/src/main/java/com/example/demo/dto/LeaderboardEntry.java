package com.example.demo.dto;

public class LeaderboardEntry {
    private String username;
    private Integer score;
    private Long timeTaken;

    public LeaderboardEntry(String username, Integer score, Long timeTaken) {
        this.username = username;
        this.score = score;
        this.timeTaken = timeTaken;
    }

    public String getUsername() {
        return username;
    }

    public Integer getScore() {
        return score;
    }

    public Long getTimeTaken() {
        return timeTaken;
    }
}