import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TestService } from '../../../services/test.service';
import { DecimalPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-tests-taken',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DecimalPipe,
    DatePipe
  ],
  templateUrl: './tests-taken.component.html',
  styleUrls: ['./tests-taken.component.css']
})
export class TestsTakenComponent implements OnInit {
  submissions: any[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(private testService: TestService) { }

  ngOnInit(): void {
    this.loadTestSubmissions();
  }

  loadTestSubmissions(): void {
    this.testService.getTestSubmissions().subscribe({
      next: (data) => {
        this.submissions = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load test submissions', err);
        this.error = 'Failed to load your test submissions. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  getScoreColor(percentage: number): string {
    if (percentage >= 70) return 'text-green-500';
    if (percentage >= 40) return 'text-yellow-500';
    return 'text-red-500';
  }
}