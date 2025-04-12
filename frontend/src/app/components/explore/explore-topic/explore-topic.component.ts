import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Topic } from '../../../models/topic.interface';
import { Test } from '../../../models/test.interface';
import { TopicService } from '../../../services/topic.service';
import { TestService } from '../../../services/test.service';

@Component({
  selector: 'app-explore-topic',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="explore-topic" *ngIf="topic">
      <div class="topic-header">
        <div class="topic-content">
          <h1 class="topic-title">{{topic.name}}</h1>
          <p class="topic-description">{{topic.description}}</p>
        </div>
      </div>

      <div class="filters-section">
        <div class="filters">
          <button class="filter-button" (click)="filterByDifficulty()">
            Difficulty: {{selectedDifficulty || 'All'}}
          </button>
          <button class="filter-button" (click)="filterByDuration()">
            Duration: {{selectedDuration || 'All'}}
          </button>
        </div>
      </div>

      <div class="tests-grid">
        <div *ngIf="!isLoading && filteredTests.length === 0" class="no-results">
          No tests match the selected filters
        </div>
        <div *ngIf="isLoading" class="loading">Loading tests...</div>
        <div class="test-card" *ngFor="let test of filteredTests">
          <div class="test-content">
            <h3 class="test-title">{{test.title}}</h3>
            <p class="test-details">
              Duration: {{test.durationMinutes}} minutes<br>
              Questions: {{test.questionCount}}<br>
              Difficulty: {{test.difficultyLevel}}
            </p>
            <button class="test-button" [routerLink]="['/test', test.id]">Take Test</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .explore-topic {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .topic-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .topic-title {
      font-size: 2.5rem;
      color: white;
      margin-bottom: 1rem;
    }

    .topic-description {
      color: #b3b3b3;
      font-size: 1.1rem;
    }

    .filters-section {
      margin-bottom: 2rem;
    }

    .filters {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .filter-button {
      padding: 0.5rem 1rem;
      background: #333;
      border: 1px solid #444;
      border-radius: 4px;
      color: #fff;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-button:hover {
      background: #444;
    }

    .tests-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .test-card {
      background: #333;
      padding: 1.5rem;
      border-radius: 8px;
      transition: all 0.3s;
    }

    .test-card:hover {
      transform: translateY(-4px);
      background: #404040;
    }

    .test-title {
      color: white;
      margin: 0 0 1rem 0;
      font-size: 1.25rem;
    }

    .test-details {
      color: #b3b3b3;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }

    .test-button {
      width: 100%;
      padding: 0.75rem;
      background: var(--primary-color);
      border: none;
      border-radius: 4px;
      color: white;
      cursor: pointer;
      transition: background 0.2s;
    }

    .test-button:hover {
      background: var(--primary-color-dark);
    }

    .no-results, .loading {
      text-align: center;
      padding: 2rem;
      color: #666;
      font-size: 1.1rem;
      grid-column: 1 / -1;
    }
  `]
})
export class ExploreTopicComponent implements OnInit {
  topic?: Topic;
  tests: Test[] = [];
  filteredTests: Test[] = [];
  selectedDifficulty?: string;
  selectedDuration?: string;
  isLoading = true;
  
  difficultyLevels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
  durationRanges = ['0-30', '31-60', '60+'];

  constructor(
    private route: ActivatedRoute,
    private topicService: TopicService,
    private testService: TestService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const topicId = params['id'];
      this.loadTopicAndTests(topicId);
    });
  }

  private loadTopicAndTests(topicId: string) {
    this.isLoading = true;
    
    this.topicService.getTopicById(+topicId).subscribe({
      next: (topic) => {
        this.topic = topic;
      },
      error: (error) => {
        console.error('Error loading topic:', error);
        this.isLoading = false;
      }
    });

    this.testService.getTestsByTopicId(topicId).subscribe({
      next: (tests) => {
        this.tests = tests;
        this.filteredTests = tests;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tests:', error);
        this.isLoading = false;
      }
    });
  }

  filterByDifficulty() {
    if (!this.selectedDifficulty || this.selectedDifficulty === 'All') {
      this.selectedDifficulty = 'All';
      this.applyFilters();
      return;
    }

    this.selectedDifficulty = this.selectedDifficulty === 'All' ? 
      this.difficultyLevels[0] : 
      this.difficultyLevels[(this.difficultyLevels.indexOf(this.selectedDifficulty) + 1) % this.difficultyLevels.length];
    
    this.applyFilters();
  }

  filterByDuration() {
    if (!this.selectedDuration || this.selectedDuration === 'All') {
      this.selectedDuration = 'All';
      this.applyFilters();
      return;
    }

    this.selectedDuration = this.selectedDuration === 'All' ? 
      this.durationRanges[0] : 
      this.durationRanges[(this.durationRanges.indexOf(this.selectedDuration) + 1) % this.durationRanges.length];
    
    this.applyFilters();
  }

  private applyFilters() {
    this.filteredTests = this.tests.filter(test => {
      const difficultyMatch = this.selectedDifficulty === 'All' || 
                            test.difficultyLevel === this.selectedDifficulty;

      let durationMatch = true;
      if (this.selectedDuration && this.selectedDuration !== 'All') {
        const [min, max] = this.selectedDuration.split('-').map(Number);
        if (max) {
          durationMatch = test.durationMinutes >= min && test.durationMinutes <= max;
        } else {
          durationMatch = test.durationMinutes >= min;
        }
      }

      return difficultyMatch && durationMatch;
    });
  }
}