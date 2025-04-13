package com.example.demo.service;

import com.example.demo.Model.Question;
import com.example.demo.Model.QuestionResponse;
import com.example.demo.Model.Test;
import com.example.demo.Model.TestSubmission;
import com.example.demo.Model.User;
import com.example.demo.dto.CreateTestRequest;
import com.example.demo.dto.LeaderboardEntry;
import com.example.demo.dto.testCreation.QuestionRequest;
import com.example.demo.dto.testCreation.TestCaseDto;
import com.example.demo.repository.QuestionRepository;
import com.example.demo.repository.TestRepository;
import com.example.demo.repository.TestSubmissionRepository;
import com.example.demo.repository.UserRepository;
import jakarta.persistence.EntityManager;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TestService {
    
    @Autowired
    private TestRepository testRepository;
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TestSubmissionRepository testSubmissionRepository;
    
    @Autowired
    private EntityManager entityManager;

    public Test createTest(CreateTestRequest request) {
        // Validate creatorId
        System.out.println("Received creatorId: " + request.getCreatorId());

        if (!userRepository.existsById(request.getCreatorId())) {
            throw new IllegalArgumentException("Invalid creatorId: " + request.getCreatorId());
        }
    
        Test test = new Test();
        test.setTitle(request.getTitle());
        test.setTopicId(request.getTopicId());
        test.setCreatorId(request.getCreatorId());
        test.setDurationMinutes(request.getDurationMinutes());
        test.setQuestionCount(request.getQuestionCount());
        test.setDifficultyLevel(request.getDifficultyLevel());
        test.setDescription(request.getDescription());
        test.setCreatedBy(request.getCreatorId()); 
    
        return testRepository.save(test);
    }
    
    public Test getTestById(Long id) {
        return testRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Test not found with id: " + id));
    }
    
    public List<Test> getTestsByCreator(Long creatorId) {
        return testRepository.findByCreatorId(creatorId);
    }

    public void addQuestionsToTest(Long testId, List<QuestionRequest> questions) {
        try {
            Test test = testRepository.findById(testId)
                    .orElseThrow(() -> new RuntimeException("Test not found with id: " + testId));

            System.out.println("Found test: " + test.getId()); // Debug log
            
            if (questions == null || questions.isEmpty()) {
                throw new RuntimeException("No questions provided");
            }

            List<Question> questionEntities = questions.stream().map(q -> {
                Question question = new Question();
                question.setTest(test);
                question.setType(q.getType());
                question.setQuestionText(q.getQuestionText());
                question.setMarks(q.getMarks());

                if ("mcq".equalsIgnoreCase(q.getType())) {
                    question.setOptions(String.join(";", q.getOptions()));
                    question.setCorrectAnswer(q.getCorrectAnswer());
                } else if ("coding".equalsIgnoreCase(q.getType())) {
                    String testCases = q.getTestCases().stream()
                        .map(tc -> tc.getInput() + "=>" + tc.getExpectedOutput())
                        .collect(Collectors.joining(";"));
                    question.setTestCases(testCases);
                }

                return question;
            }).collect(Collectors.toList());

            System.out.println("Saving " + questionEntities.size() + " questions"); // Debug log
            questionRepository.saveAll(questionEntities);
            System.out.println("Questions saved successfully");
        } catch (Exception e) {
            System.err.println("Error saving questions: " + e.getMessage());
            e.printStackTrace();
            throw e; // Re-throw to let controller handle it
        }
    }
    
    public int getQuestionCount(Long testId) {
        return questionRepository.countByTestId(testId);
    }
    
    public List<Map<String, Object>> getQuestionsForTest(Long testId) {
        try {
            List<Question> questions = questionRepository.findByTestId(testId);
            System.out.println("Found " + questions.size() + " questions for test " + testId);
            
            return questions.stream().map(q -> {
                Map<String, Object> questionMap = new HashMap<>();
                questionMap.put("id", q.getId());
                questionMap.put("questionText", q.getQuestionText());
                questionMap.put("type", q.getType().toLowerCase());
                questionMap.put("testId", testId);
                questionMap.put("marks", q.getMarks());
                
                if ("mcq".equalsIgnoreCase(q.getType())) {
                    if (q.getOptions() != null) {
                        questionMap.put("options", Arrays.asList(q.getOptions().split(";")));
                    } else {
                        questionMap.put("options", new ArrayList<>());
                    }
                } else if ("coding".equalsIgnoreCase(q.getType())) {
                    // Ensure options array exists even for coding questions (frontend expects it)
                    questionMap.put("options", new ArrayList<>());
                    
                    if (q.getTestCases() != null) {
                        String[] testCasePairs = q.getTestCases().split(";");
                        List<Map<String, String>> testCases = new ArrayList<>();
                        
                        for (String pair : testCasePairs) {
                            String[] parts = pair.split("=>");
                            if (parts.length == 2) {
                                Map<String, String> testCase = new HashMap<>();
                                testCase.put("input", parts[0]);
                                testCase.put("expectedOutput", parts[1]);
                                testCases.add(testCase);
                            }
                        }
                        
                        questionMap.put("testCases", testCases);
                    } else {
                        questionMap.put("testCases", new ArrayList<>());
                    }
                }
                
                return questionMap;
            }).collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error in getQuestionsForTest: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
        
    }

    @Transactional
    public Map<String, Object> processTestSubmission(Long testId, Long userId, List<Map<String, Object>> answers, int pointsChange) {  // Add pointsChange parameter
        // Retrieve the test
        Test test = testRepository.findById(testId)
            .orElseThrow(() -> new RuntimeException("Test not found with id: " + testId));
        
        // Update creator's points based on rating
         // Update creator's points
        User creator = userRepository.findById(test.getCreatorId())
            .orElseThrow(() -> new RuntimeException("Test creator not found"));
        creator.setTotalPoints(creator.getTotalPoints() + pointsChange);
        userRepository.save(creator);


        // Create a test submission record
        TestSubmission submission = new TestSubmission();
        submission.setTest(test);
        submission.setUserId(userId);
        submission.setSubmittedAt(new Date());
        
        // Basic validation of answers
        if (answers == null || answers.isEmpty()) {
            throw new RuntimeException("No answers provided");
        }
        
        // Debug log to see what answers we received
        System.out.println("Received " + answers.size() + " answers");
        
        // Save the submission
        TestSubmission savedSubmission = testSubmissionRepository.save(submission);
        
        // Calculate total score
        int totalScore = 0;
        
        // Process each answer
        for (Map<String, Object> answer : answers) {
            try {
                // Debug log to see each answer structure
                System.out.println("Processing answer: " + answer);
                
                if (!answer.containsKey("questionId")) {
                    System.err.println("Answer missing questionId, skipping");
                    continue;
                }
                
                Long questionId = Long.parseLong(answer.get("questionId").toString());
                System.out.println("Looking up question: " + questionId);
                
                Question question = questionRepository.findById(questionId)
                    .orElseThrow(() -> new RuntimeException("Question not found with id: " + questionId));
                
                QuestionResponse response = new QuestionResponse();
                response.setSubmission(savedSubmission);
                response.setQuestion(question);
                response.setUserId(userId);
                response.setSubmittedAt(new Date());
                
                boolean isCorrect = false;
                int pointsEarned = 0;
                
                // Process based on question type
                if ("mcq".equalsIgnoreCase(question.getType())) {
                    // Handle MCQ - check either selectedOption or answer field
                    Object answerValue = null;
                    
                    if (answer.containsKey("selectedOption")) {
                        answerValue = answer.get("selectedOption");
                    } else if (answer.containsKey("answer")) {
                        // This is the format coming from the frontend
                        answerValue = answer.get("answer");
                    }
                    
                    if (answerValue != null) {
                        Integer selectedOption = Integer.parseInt(answerValue.toString());
                        
                        // Store the selected option number in answer_text rather than as an ID
                        // This avoids the foreign key constraint error
                        response.setSelectedOptionId(null);
                        response.setAnswerText("Option " + selectedOption);
                        
                        // Debug information
                        System.out.println("Selected option: " + selectedOption);
                        System.out.println("Correct answer: " + question.getCorrectAnswer());
                        
                        // Check if answer is correct - comparing the integer values directly
                        isCorrect = selectedOption.intValue() == question.getCorrectAnswer().intValue();
                        pointsEarned = isCorrect ? question.getMarks() : 0;
                        
                        System.out.println("MCQ answer: " + selectedOption + ", correct: " + isCorrect + 
                                          ", score: " + pointsEarned);
                    } else {
                        System.out.println("MCQ answer missing both selectedOption and answer fields");
                    }
                } else if ("coding".equalsIgnoreCase(question.getType())) {
                    // Handle coding question - check various possible field names
                    String answerText = null;
                    
                    if (answer.containsKey("answerText")) {
                        answerText = answer.get("answerText").toString();
                    } else if (answer.containsKey("userCode")) {
                        answerText = answer.get("userCode").toString();
                    } else if (answer.containsKey("answer")) {
                        // This is the format coming from the frontend
                        answerText = answer.get("answer").toString();
                    }
                    
                    if (answerText != null) {
                        response.setAnswerText(answerText);
                        
                        // In a real system, you'd evaluate the code here against test cases
                        // For now, just giving partial credit
                        isCorrect = true; // Simplified for now
                        pointsEarned = question.getMarks() / 2; // Simplified scoring
                        
                        System.out.println("Coding answer received, score: " + pointsEarned);
                    } else {
                        System.out.println("Coding answer missing all possible answer fields");
                    }
                }
                
                response.setIsCorrect(isCorrect);
                response.setPointsEarned(pointsEarned);
                
                // Save question response - with better error handling
                try {
                    entityManager.persist(response);
                    System.out.println("Persisted question response for question " + questionId);
                } catch (Exception e) {
                    System.err.println("Failed to persist question response: " + e.getMessage());
                    e.printStackTrace();
                    throw e; // Re-throw to properly roll back transaction
                }
                
                // Add to total score
                totalScore += pointsEarned;
            } catch (Exception e) {
                System.err.println("Error processing answer: " + e.getMessage());
                e.printStackTrace();
                // Continue with other answers
            }
        }
        
        // Update submission with total score
        savedSubmission.setScore(totalScore);
        testSubmissionRepository.save(savedSubmission);
        
        Map<String, Object> result = new HashMap<>();
        result.put("message", "Test submitted successfully");
        result.put("testId", testId);
        result.put("submissionId", savedSubmission.getId());
        result.put("submittedAt", submission.getSubmittedAt());
        result.put("score", totalScore);
        savedSubmission.setScore(totalScore);
        testSubmissionRepository.save(savedSubmission);
        
        return result;
    }
/**
 * Get all test submissions for a specific user
 */
public List<Map<String, Object>> getTestSubmissionsByUser(Long userId) {
    try {
        List<TestSubmission> submissions = testSubmissionRepository.findByUserId(userId);
        System.out.println("Found " + submissions.size() + " submissions for user " + userId);

        return submissions.stream()
            .filter(submission -> submission.getTest() != null) // Filter out submissions with null test
            .map(submission -> {
                Map<String, Object> result = new HashMap<>();
                result.put("id", submission.getId());
                
                Test test = submission.getTest();
                result.put("testId", test.getId());
                result.put("testTitle", test.getTitle());
                result.put("submittedAt", submission.getSubmittedAt());
                
                // Handle score with null check
                Integer score = submission.getScore();
                int actualScore = (score != null) ? score : 0;
                result.put("score", actualScore);
                
                // Calculate total possible score safely
                int totalPossibleScore = questionRepository.findByTestId(test.getId())
                    .stream()
                    .mapToInt(q -> q.getMarks() != null ? q.getMarks() : 0)
                    .sum();
                
                result.put("totalPossibleScore", totalPossibleScore);
                
                // Calculate percentage safely
                double percentage = totalPossibleScore > 0 ? 
                    (actualScore * 100.0) / totalPossibleScore : 0.0;
                result.put("percentage", Math.round(percentage * 100.0) / 100.0); // Round to 2 decimal places
                
                return result;
            })
            .collect(Collectors.toList());
    } catch (Exception e) {
        System.err.println("Error getting user test submissions: " + e.getMessage());
        e.printStackTrace();
        throw new RuntimeException("Failed to get test submissions", e);
    }
}
    public List<LeaderboardEntry> getLeaderboardForTest(Long testId) {
        return testSubmissionRepository.findLeaderboardByTestId(testId);
    }
}