package com.example.demo.repository;

import com.example.demo.Model.Test;
import com.example.demo.dto.UserScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TestRepository extends JpaRepository<Test, Long> {
    // Find tests by topic
    List<Test> findByTopicId(Long topicId);
    List<Test> findByCreatorId(Long creatorId);
    // Count tests created by user
    @Query("SELECT COUNT(t) FROM Test t WHERE t.createdBy = :userId")
    int countByCreatedBy(@Param("userId") Long userId);

    // Count tests taken by user
    @Query("SELECT COUNT(tr) FROM TestResult tr WHERE tr.userId = :userId")
    int countTestsTakenByUser(@Param("userId") Long userId);

    // Get all user scores for ranking
    @Query("SELECT new com.example.demo.dto.UserScore(tr.userId, SUM(tr.score)) " +
           "FROM TestResult tr GROUP BY tr.userId")
    List<UserScore> findAllUserScores();
}
