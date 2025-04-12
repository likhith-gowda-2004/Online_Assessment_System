package com.example.demo.controller;

import com.example.demo.JwtUtils;
import com.example.demo.Model.Test;
// import com.example.demo.Model.TestSubmission;
import com.example.demo.dto.CreateTestRequest;
import com.example.demo.dto.LeaderboardEntry;
// import com.example.demo.Model.TestSubmission;
// import com.example.demo.dto.CreateTestRequest;
import com.example.demo.dto.QuestionCountResponse;
import com.example.demo.dto.testCreation.QuestionRequest;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
// import java.util.HashMap;
import java.util.List;
import java.util.Map;
// import java.util.Date;
import java.util.HashMap;
// import java.util.List;
// import java.util.Map;
import java.util.Date;

@RestController
@RequestMapping("/api/tests")
@CrossOrigin(origins = "http://localhost:4200", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class TestController {

    @Autowired
    private TestService testService;
    
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createTest(@RequestBody CreateTestRequest request) {
        System.out.println("Request in Controller: " + request);
        Long creatorId = getCurrentUserId();

        if (creatorId == null) {
            return ResponseEntity.badRequest().body("Creator ID must not be null. Please log in.");
        }

        request.setCreatorId(creatorId);

        if (request.getTitle() == null || request.getTitle().isEmpty()) {
            return ResponseEntity.badRequest().body("Title must not be null or empty.");
        }
        if (request.getDurationMinutes() == null || request.getDurationMinutes() <= 0) {
            return ResponseEntity.badRequest().body("Duration must be greater than 0.");
        }
        if (request.getQuestionCount() == null || request.getQuestionCount() <= 0) {
            return ResponseEntity.badRequest().body("Question count must be greater than 0.");
        }

        Test createdTest = testService.createTest(request);
        return ResponseEntity.ok(createdTest.getId()); // Return the test ID
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Test> getTestById(@PathVariable Long id) {
        Test test = testService.getTestById(id);
        return ResponseEntity.ok(test);
    }
    
    @GetMapping("/created")
    public ResponseEntity<List<Test>> getCreatedTests() {
        try {
            Long userId = getCurrentUserId();
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            List<Test> tests = testService.getTestsByCreator(userId);
            return ResponseEntity.ok(tests);
        } catch (Exception e) {
            // Log the exception
            System.err.println("Error in getCreatedTests: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{testId}/questions")
    public ResponseEntity<?> addQuestions(@PathVariable Long testId, @RequestBody List<QuestionRequest> questions) {
        try {
            testService.addQuestionsToTest(testId, questions);
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body("{\"message\": \"Questions added successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/{testId}/questions")
    public ResponseEntity<?> getQuestionsForTest(@PathVariable Long testId) {
        try {
            System.out.println("Received GET request for questions for test ID: " + testId);
            
            // Check if user is authorized to access this test
            Long userId = getCurrentUserId();
            System.out.println("User ID from token: " + userId);
            
            if (userId == null) {
                System.out.println("Unauthorized: No valid user ID found in token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            List<Map<String, Object>> questions = testService.getQuestionsForTest(testId);
            System.out.println("Retrieved " + questions.size() + " questions for test ID: " + testId);
            
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            System.err.println("Error getting questions: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to retrieve questions: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{testId}/questions/count")
    public ResponseEntity<QuestionCountResponse> getQuestionCountForTest(@PathVariable Long testId) {
        int count = testService.getQuestionCount(testId);
        return ResponseEntity.ok(new QuestionCountResponse(count));
    }
    
    private Long getCurrentUserId() {
        String token = getJwtFromRequest();
        if (token != null) {
            try {
                // Extract the username from the token
                System.out.println("Token in getCurrentUserId: " + token);
                String username = jwtUtils.extractUsername(token);
    
                // Retrieve the user ID from the database using the username
                com.example.demo.Model.User user = userRepository.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("User not found"));
                System.out.println("User ID in getCurrentUserId: " + user.getId());
                return user.getId();
            } catch (Exception e) {
                System.out.println("Error extracting user ID from JWT: " + e.getMessage());
            }
        }
        System.out.println("No valid token found");
        return null;
    }
    
    private String getJwtFromRequest() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String bearerToken = request.getHeader("Authorization");
        
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        
        return null;
    }
    
    @PostMapping("/{testId}/submit")
    public ResponseEntity<?> submitTestAnswers(
            @PathVariable Long testId,
            @RequestBody Map<String, Object> submission) {
        
        try {
            Long userId = getCurrentUserId();
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            // Extract answers and rating from submission
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> answers = (List<Map<String, Object>>) submission.get("answers");
            Integer rating = (Integer) submission.get("rating");
            
            // Validate rating
            if (rating == null || rating < 1 || rating > 5) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Rating must be between 1 and 5"));
            }
            
            // Calculate points change based on rating
            System.out.println("Rating: " + rating);
            System.out.println("Answers: " + answers);
            int pointsChange = switch (rating) {
                case 1 -> -10;
                case 2 -> -5;
                case 3 -> 0;
                case 4 -> 5;
                case 5 -> 10;
                default -> 0;
            };
            System.out.println("Points change: " + pointsChange);
            // Process submission and update creator points
            Map<String, Object> result = testService.processTestSubmission(testId, userId, answers, pointsChange);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("Error submitting test: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to submit test: " + e.getMessage()));
        }
    }
    // Add this endpoint to your TestController class

    @GetMapping("/submissions")
    public ResponseEntity<?> getUserTestSubmissions() {
        try {
            Long userId = getCurrentUserId();
            System.out.println("Getting submissions for user ID: " + userId);
            
            if (userId == null) {
                System.out.println("Unauthorized: No valid user ID found in token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            List<Map<String, Object>> submissions = testService.getTestSubmissionsByUser(userId);
            System.out.println("Found " + submissions.size() + " submissions for user");
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            System.err.println("Error getting user test submissions: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to retrieve test submissions: " + e.getMessage()));
        }
    }

    @GetMapping("/{testId}/leaderboard")
    public ResponseEntity<?> getLeaderboard(@PathVariable Long testId) {
        try {
            List<LeaderboardEntry> leaderboard = testService.getLeaderboardForTest(testId);
            return ResponseEntity.ok(leaderboard);
        } catch (Exception e) {
            System.err.println("Error fetching leaderboard: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch leaderboard: " + e.getMessage()));
        }
    }
}