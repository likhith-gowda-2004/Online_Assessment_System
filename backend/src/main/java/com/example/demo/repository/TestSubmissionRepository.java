package com.example.demo.repository;

import com.example.demo.Model.TestSubmission;
import com.example.demo.dto.LeaderboardEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestSubmissionRepository extends JpaRepository<TestSubmission, Long> {
    List<TestSubmission> findByUserId(Long userId);

    @Query("SELECT new com.example.demo.dto.LeaderboardEntry(u.username, ts.score, 0L) " +
           "FROM TestSubmission ts " +
           "JOIN ts.test t " +
           "JOIN User u ON ts.userId = u.id " +
           "WHERE t.id = :testId " +
           "ORDER BY ts.score DESC, ts.submittedAt ASC")
    List<LeaderboardEntry> findLeaderboardByTestId(@Param("testId") Long testId);
}