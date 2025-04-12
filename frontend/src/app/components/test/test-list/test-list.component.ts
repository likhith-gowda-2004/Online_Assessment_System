import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TestService } from '../../../services/test.service';
import { TopicService } from '../../../services/topic.service';
import { Test } from '../../../models/test.interface';
import { Topic } from '../../../models/topic.interface';

@Component({
  selector: 'app-test-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './test-list.component.html',
  styleUrl: './test-list.component.css'
})
export class TestListComponent implements OnInit {
  tests: Test[] = [];
  isLoading: boolean = true;
  topicsMap: Map<number, string> = new Map();
  
  constructor(
    private testService: TestService,
    private topicService: TopicService
  ) {}
  
  ngOnInit(): void {
    this.loadTests();
    this.loadTopics();
  }
  
  loadTests(): void {
    this.testService.getCreatedTests().subscribe({
      next: (tests: Test[]) => {
        this.tests = tests;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading tests:', error);
        this.isLoading = false;
      }
    });
  }
  
  loadTopics(): void {
    this.topicService.getTopics().subscribe({
      next: (topics: Topic[]) => {
        topics.forEach(topic => {
          // Ensure topic.id is treated as a number
          this.topicsMap.set(Number(topic.id), topic.name);
        });
      },
      error: (error: any) => {
        console.error('Error loading topics:', error);
      }
    });
  }
  
  getTopicName(topicId: number): string {
    return this.topicsMap.get(topicId) || 'Unknown Topic';
  }
}