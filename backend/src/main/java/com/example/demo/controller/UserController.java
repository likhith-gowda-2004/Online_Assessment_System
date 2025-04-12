package com.example.demo.controller;

import com.example.demo.dto.UserStats;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
    private final UserService userService;

    @GetMapping("/{username}/stats")
    public ResponseEntity<UserStats> getUserStats(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserStats(username));
    }
}