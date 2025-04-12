package com.example.demo.Model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Table(name = "test_submissions")
@Data
public class TestSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "test_id")
    private Test test;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "submitted_at")
    private Date submittedAt;
    
    @Column(name = "score")
    private Integer score;
    
    // You could add more fields as needed for your application
}