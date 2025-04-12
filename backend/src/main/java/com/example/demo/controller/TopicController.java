package com.example.demo.controller;

import com.example.demo.Model.Topic;
import com.example.demo.Model.Test;
import com.example.demo.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class TopicController {
    private final TopicService topicService;

    @GetMapping
    public ResponseEntity<List<Topic>> getAllTopics() {
        return ResponseEntity.ok(topicService.getAllTopics());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Topic> getTopicById(@PathVariable Long id) {
        return ResponseEntity.ok(topicService.getTopicById(id));
    }

    @GetMapping("/{id}/tests")
    public ResponseEntity<List<Test>> getTestsByTopicId(@PathVariable Long id) {
        return ResponseEntity.ok(topicService.getTestsByTopicId(id));
    }
}