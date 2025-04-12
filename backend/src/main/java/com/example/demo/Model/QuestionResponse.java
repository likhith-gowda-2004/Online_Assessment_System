package com.example.demo.Model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "question_responses")
public class QuestionResponse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id")
    private TestSubmission submission;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "answer_text", columnDefinition = "TEXT")
    private String answerText;
    
    @Column(name = "selected_option_id")
    private Long selectedOptionId;
    
    @Column(name = "is_correct")
    private Boolean isCorrect;
    
    @Column(name = "points_earned")
    private Integer pointsEarned;
    
    @Column(name = "submitted_at")
    private Date submittedAt = new Date();
    
    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TestSubmission getSubmission() {
        return submission;
    }

    public void setSubmission(TestSubmission submission) {
        this.submission = submission;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getAnswerText() {
        return answerText;
    }

    public void setAnswerText(String answerText) {
        this.answerText = answerText;
    }

    public Long getSelectedOptionId() {
        return selectedOptionId;
    }

    public void setSelectedOptionId(Long selectedOptionId) {
        this.selectedOptionId = selectedOptionId;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }

    public Integer getPointsEarned() {
        return pointsEarned;
    }

    public void setPointsEarned(Integer pointsEarned) {
        this.pointsEarned = pointsEarned;
    }

    public Date getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(Date submittedAt) {
        this.submittedAt = submittedAt;
    }

    @Override
    public String toString() {
        return "QuestionResponse{" +
                "id=" + id +
                ", submission=" + (submission != null ? submission.getId() : null) +
                ", question=" + (question != null ? question.getId() : null) +
                ", userId=" + userId +
                ", selectedOptionId=" + selectedOptionId +
                ", isCorrect=" + isCorrect +
                ", pointsEarned=" + pointsEarned +
                '}';
    }
}