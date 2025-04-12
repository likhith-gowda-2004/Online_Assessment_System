import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Topic } from '../../models/topic.interface';
import { TopicService } from '../../services/topic.service';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="explore-page">
      <header class="explore-header">
        <h1>Explore Topics</h1>
        <p>Browse our collection of assessment topics and find the perfect test for you</p>
      </header>

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
    </div>
  `,
  styles: [`
    .explore-page {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .explore-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .explore-header h1 {
      font-size: 2.5rem;
      color: white;
      margin-bottom: 1rem;
    }

    .explore-header p {
      color: #b3b3b3;
      font-size: 1.1rem;
    }

    .topics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .topic-card {
      background: #333;
      padding: 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      color: inherit;
      transition: all 0.3s ease;
    }

    .topic-card:hover {
      transform: translateY(-4px);
      background: #404040;
    }

    .topic-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .topic-title {
      color: white;
      margin: 0;
      font-size: 1.25rem;
    }

    .test-count {
      color: var(--primary-color);
      font-size: 0.9rem;
    }

    .topic-description {
      color: #b3b3b3;
      margin-bottom: 1rem;
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
  `]
})
export class ExploreComponent implements OnInit {
  topics: Topic[] = [];

  constructor(private topicService: TopicService) {}

  ngOnInit() {
    this.topicService.getTopics().subscribe(topics => {
      this.topics = topics;
    });
  }
}