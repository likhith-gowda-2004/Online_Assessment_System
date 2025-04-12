import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Topic } from '../../models/topic.interface';
import { TopicService } from '../../services/topic.service';

@Component({
  selector: 'app-explore-dropdown',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dropdown-container">
      <div class="topics-grid">
        <a *ngFor="let topic of topics" 
           [routerLink]="['/explore', topic.id]" 
           class="topic-card">
          <div class="topic-header">
            <h3 class="topic-title">{{topic.name}}</h3>
            <span class="test-count">{{topic.testsCount}} tests</span>
          </div>
          <p class="topic-description">{{topic.description}}</p>
          <div class="topic-categories">
            <ng-container *ngIf="topic.categories && topic.categories.length > 0">
              <span *ngFor="let category of topic.categories.slice(0, 3)" 
                    class="category-tag">{{category}}</span>
              <span *ngIf="topic.categories.length > 3" 
                    class="more-tag">+{{topic.categories.length - 3}} more</span>
            </ng-container>
          </div>
        </a>
      </div>
      <div class="dropdown-footer">
        <a routerLink="/explore" class="view-all">
          View all categories
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .dropdown-container {
      width: 600px;
      background: #282828;
      border: 1px solid #404040;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .topics-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .topic-card {
      background: #333;
      padding: 1rem;
      border-radius: 6px;
      text-decoration: none;
      color: inherit;
      transition: all 0.2s;
    }

    .topic-card:hover {
      background: #404040;
      transform: translateY(-2px);
    }

    .topic-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .topic-title {
      color: white;
      margin: 0;
      font-size: 1rem;
      font-weight: 500;
    }

    .test-count {
      color: var(--primary-color);
      font-size: 0.875rem;
    }

    .topic-description {
      color: #b3b3b3;
      font-size: 0.875rem;
      margin-bottom: 0.75rem;
    }

    .topic-categories {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .category-tag {
      background: #404040;
      color: #b3b3b3;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
    }

    .more-tag {
      color: var(--primary-color);
      font-size: 0.75rem;
    }

    .dropdown-footer {
      border-top: 1px solid #404040;
      padding-top: 1rem;
      text-align: center;
    }

    .view-all {
      color: var(--primary-color);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }

    .view-all:hover {
      text-decoration: underline;
    }
  `]
})
export class ExploreDropdownComponent implements OnInit {
  topics: Topic[] = [];

  constructor(private topicService: TopicService) {}

  ngOnInit() {
    this.topicService.getTopics().subscribe(topics => {
      this.topics = topics;
    });
  }
}