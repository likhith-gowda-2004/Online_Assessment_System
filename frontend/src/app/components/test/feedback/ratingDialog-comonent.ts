import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-rating-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="rating-dialog">
      <h2 mat-dialog-title>Rate This Test</h2>
      <div mat-dialog-content>
        <p class="rating-info">Your rating helps improve the platform:</p>
        <div class="stars">
          <span *ngFor="let star of [1,2,3,4,5]" 
                (click)="setRating(star)"
                [class.selected]="rating >= star"
                [class.hovered]="hoveredRating >= star"
                (mouseenter)="hoveredRating = star"
                (mouseleave)="hoveredRating = 0">
            ★
          </span>
        </div>
        <div class="rating-description" *ngIf="rating">
          {{ getRatingDescription(rating) }}
        </div>
      </div>
      <div mat-dialog-actions>
        <button mat-button (click)="close()">Cancel</button>
        <button mat-raised-button color="primary" 
                [disabled]="!rating"
                (click)="submit()">
          Submit Rating
        </button>
      </div>
    </div>
  `,
  styles: [`
    .rating-dialog {
      padding: 20px;
      max-width: 400px;
    }
    .stars {
      display: flex;
      gap: 8px;
      font-size: 32px;
      padding: 20px 0;
      cursor: pointer;
    }
    .stars span {
      color: #ddd;
      transition: all 0.2s ease;
    }
    .stars span.selected {
      color: #ffd700;
    }
    .stars span.hovered {
      color: #ffed4a;
    }
    .rating-description {
      margin-top: 16px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 4px;
      font-size: 14px;
    }
    .rating-info {
      color: #666;
      margin-bottom: 8px;
    }
  `]
})
export class RatingDialogComponent {
  rating: number = 0;
  hoveredRating: number = 0;

  constructor(
    private dialogRef: MatDialogRef<RatingDialogComponent>
  ) {}

  setRating(value: number): void {
    this.rating = value;
  }

  getRatingDescription(rating: number): string {
    switch(rating) {
      case 5: return '★★★★★ Excellent (+10 points)';
      case 4: return '★★★★☆ Good (+5 points)';
      case 3: return '★★★☆☆ Average (0 points)';
      case 2: return '★★☆☆☆ Below Average (-5 points)';
      case 1: return '★☆☆☆☆ Poor (-10 points)';
      default: return '';
    }
  }

  submit(): void {
    this.dialogRef.close(this.rating);
  }

  close(): void {
    this.dialogRef.close();
  }
}