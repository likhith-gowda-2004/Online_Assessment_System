package com.example.demo.repository;

import com.example.demo.Model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository interface for Question entity
 */
@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    
    /**
     * Count the number of questions for a specific test
     * 
     * @param testId the ID of the test
     * @return the count of questions
     */
    @Query("SELECT COUNT(q) FROM Question q WHERE q.test.id = :testId")
    int countByTestId(@Param("testId") Long testId);
    
    /**
     * Find all questions for a specific test
     * 
     * @param testId the ID of the test
     * @return list of questions
     */
    @Query("SELECT q FROM Question q WHERE q.test.id = :testId ORDER BY q.id")
    List<Question> findByTestId(@Param("testId") Long testId);
}