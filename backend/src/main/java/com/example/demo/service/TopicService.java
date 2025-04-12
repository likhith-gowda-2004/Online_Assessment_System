package com.example.demo.service;

import com.example.demo.Model.Topic;
import com.example.demo.Model.Test;
import com.example.demo.repository.TopicRepository;
import com.example.demo.repository.TestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TopicService {
    private final TopicRepository topicRepository;
    private final TestRepository testRepository;

    public List<Topic> getAllTopics() {
        return topicRepository.findAll();
    }

    public Topic getTopicById(Long id) {
        return topicRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Topic not found"));
    }

    public List<Test> getTestsByTopicId(Long topicId) {
        return testRepository.findByTopicId(topicId);
    }
}