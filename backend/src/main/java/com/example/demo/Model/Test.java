package com.example.demo.Model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "tests")
@Data
public class Test {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT", nullable = true)
    private String description;
    
    @Column(name = "topic_id", nullable = true)
    private Long topicId;
    
    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;
    
    @Column(name = "question_count", nullable = false)
    private Integer questionCount;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty_level", nullable = true)
    private DifficultyLevel difficultyLevel;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "created_by", nullable = true)
    private Long createdBy;
    
    @Column(name = "creator_id", nullable = false)
    private Long creatorId;
    
    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
    
    public enum DifficultyLevel {
        BEGINNER, INTERMEDIATE, ADVANCED
    }
}