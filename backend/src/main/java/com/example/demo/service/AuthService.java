package com.example.demo.service;

import com.example.demo.Model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.dto.auth.LoginRequest;
import com.example.demo.dto.auth.SignupRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.demo.JwtUtils;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public Map<String, String> signup(SignupRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully");
        return response;
    }

   public Map<String, String> login(LoginRequest request) {
    User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        throw new RuntimeException("Invalid password");
    }

    // Generate a JWT token
    String token = jwtUtils.generateToken(user.getUsername());
    //System.out.println("Generated Token: " + token); // Debug statement

    Map<String, String> response = new HashMap<>();
    response.put("message", "Login successful");
    response.put("token", token);
    return response;
}
}