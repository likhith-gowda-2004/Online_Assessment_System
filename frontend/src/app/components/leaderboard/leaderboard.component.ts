import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule], // Add CommonModule here
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  leaderboard: any[] = [];
  isLoading = true;
  error: string | null = null;
  showAll = false; // State to toggle between top 5 and full leaderboard


  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const testId = this.route.snapshot.paramMap.get('testId'); // Get testId from the route
    if (testId) {
      this.fetchLeaderboard(testId);
    } else {
      this.error = 'Invalid test ID';
      this.isLoading = false;
    }
  }

  fetchLeaderboard(testId: string): void {
    this.http.get<any[]>(`http://localhost:8080/api/tests/${testId}/leaderboard`)
      .subscribe({
        next: (data) => {
          this.leaderboard = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching leaderboard:', err);
          this.error = 'Failed to load leaderboard. Please try again later.';
          this.isLoading = false;
        }
      });
  }
  toggleShowAll(): void {
    this.showAll = !this.showAll; // Toggle the state
  }
}
