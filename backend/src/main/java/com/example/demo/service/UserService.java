package com.example.demo.service;

import com.example.demo.Model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.TestRepository;
import com.example.demo.dto.UserStats;
import com.example.demo.dto.UserScore;
import java.util.List;

import com.example.demo.dto.auth.LoginRequest;
import com.example.demo.dto.auth.SignupRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TestRepository testRepository;
    

    public void signup(SignupRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
    }

    public String login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return "Login successful"; // In real application, return JWT token
    }

    public UserStats getUserStats(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        UserStats stats = new UserStats();
        stats.setTestsCreated((int) testRepository.countByCreatedBy(user.getId()));
        stats.setTestsTaken((int) testRepository.countTestsTakenByUser(user.getId()));
        stats.setRank(calculateUserRank(user.getId()));
        
        return stats;
    }

    private int calculateUserRank(Long userId) {
        // Get all users' scores
        List<UserScore> scores = testRepository.findAllUserScores();
        
        // Sort by score in descending order
        scores.sort((a, b) -> b.getScore().compareTo(a.getScore()));
        
        // Find current user's position
        for (int i = 0; i < scores.size(); i++) {
            if (scores.get(i).getUserId().equals(userId)) {
                return i + 1; // Adding 1 because ranks start at 1
            }
        }
        return scores.size() + 1;
    }
}