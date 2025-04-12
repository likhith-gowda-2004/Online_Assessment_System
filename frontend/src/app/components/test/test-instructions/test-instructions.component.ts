import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TestService } from '../../../services/test.service';
import { TopicService } from '../../../services/topic.service';
import { Test } from '../../../models/test.interface';

@Component({
  selector: 'app-test-instructions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './test-instructions.component.html',
  styleUrls: ['./test-instructions.component.css']
})
export class TestInstructionsComponent implements OnInit {
  test: Test | null = null;
  isLoading = true;
  error: string | null = null;
  topicName: string = 'Loading...';
  termsAccepted = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private testService: TestService,
    private topicService: TopicService
  ) {}
  
  ngOnInit(): void {
    const testId = this.route.snapshot.paramMap.get('id');
    if (!testId) {
      this.error = 'Invalid test ID';
      this.isLoading = false;
      return;
    }
    
    this.loadTestDetails(Number(testId));
  }
  
  loadTestDetails(testId: number): void {
    this.testService.getTestById(testId).subscribe({
      next: (test) => {
        this.test = test;
        this.loadTopicName(test.topicId);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading test details:', error);
        this.error = 'Failed to load test details. Please try again.';
        this.isLoading = false;
      }
    });
  }
  
  loadTopicName(topicId: number): void {
    this.topicService.getTopicById(topicId).subscribe({
      next: (topic) => {
        this.topicName = topic.name;
      },
      error: (error) => {
        console.error('Error loading topic:', error);
        this.topicName = 'Unknown Topic';
      }
    });
  }
  
  startTest(): void {
    if (this.test && this.termsAccepted) {
      // Navigate to the test-taking page
      this.router.navigate(['/test', this.test.id, 'take']);
    }
  }
}