import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TestService } from '../../../services/test.service';
import { Test } from '../../../models/test.interface';
import { TestQuestion } from '../../../models/TestQuestion.interface';
import { RatingDialogComponent } from '../feedback/ratingDialog-comonent';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-take-test',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, 
    MatDialogModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './take-test.component.html',
  styleUrls: ['./take-test.component.css']
})
export class TakeTestComponent implements OnInit, OnDestroy {
  testId: number | null = null;
  test: Test | null = null;
  questions: TestQuestion[] = [];
  currentQuestionIndex: number = 0;
  isLoading: boolean = true;
  isSubmitting: boolean = false;
  error: string | null = null;
  timeRemaining: number = 0; // in seconds
  timerInterval: any;
  
  // Track the status of each question: 'unseen', 'seen', or 'answered'
  questionStatus: string[] = [];
  
  // For mobile view menu toggle
  isPaletteVisible: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private testService: TestService,
    private dialog: MatDialog
  ) {}
  
  ngOnInit(): void {
    const testId = this.route.snapshot.paramMap.get('id');
    if (!testId) {
      this.error = 'Invalid test ID';
      this.isLoading = false;
      return;
    }
    
    this.testId = Number(testId);
    this.loadTest();
  }
  
  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
  
  loadTest(): void {
    this.testService.getTestById(this.testId as number).subscribe({
      next: (test) => {
        this.test = test;
        this.timeRemaining = test.durationMinutes * 60;
        this.startTimer();
        this.loadQuestions();
      },
      error: (error) => {
        console.error('Error loading test:', error);
        this.error = 'Failed to load test details.';
        this.isLoading = false;
      }
    });
  }
  
  loadQuestions(): void {
    this.testService.getTestQuestions(this.testId as number).subscribe({
      next: (questions) => {
        this.questions = questions;
        // Initialize question status array
        this.questionStatus = new Array(questions.length).fill('unseen');
        // Mark first question as seen
        this.markQuestionAsSeen(0);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading questions:', error);
        this.error = 'Failed to load test questions.';
        this.isLoading = false;
      }
    });
  }
  
  startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      
      if (this.timeRemaining <= 0) {
        clearInterval(this.timerInterval);
        this.submitTest(true);
      }
    }, 1000);
  }
  
  get formattedTimeRemaining(): string {
    const hours = Math.floor(this.timeRemaining / 3600);
    const minutes = Math.floor((this.timeRemaining % 3600) / 60);
    const seconds = this.timeRemaining % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  get currentQuestion(): TestQuestion | undefined {
    return this.questions[this.currentQuestionIndex];
  }
  
  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.markQuestionAsSeen(this.currentQuestionIndex);
    }
  }
  
  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.markQuestionAsSeen(this.currentQuestionIndex);
    }
  }

  goToQuestion(index: number): void {
    if (index >= 0 && index < this.questions.length) {
      this.currentQuestionIndex = index;
      this.markQuestionAsSeen(index);
    }
  }
  
  markQuestionAsSeen(index: number): void {
    if (this.questionStatus[index] === 'unseen') {
      this.questionStatus[index] = 'seen';
    }
  }
  
  selectOption(questionIndex: number, optionIndex: number): void {
    this.questions[questionIndex].userAnswer = optionIndex;
    this.questionStatus[questionIndex] = 'answered';
  }
  
  updateCode(questionIndex: number, code: string): void {
    this.questions[questionIndex].userCode = code;
    if (code && code.trim() !== '') {
      this.questionStatus[questionIndex] = 'answered';
    }
  }
  
  isQuestionAnswered(question: TestQuestion): boolean {
    if (question.type === 'mcq') {
      return question.userAnswer !== undefined;
    } else if (question.type === 'coding') {
      return !!(question.userCode && question.userCode.trim() !== '');
    }
    return false;
  }
  
  get answeredQuestionsCount(): number {
    return this.questionStatus.filter(status => status === 'answered').length;
  }
  
  submitTest(isAutoSubmit: boolean = false): void {
    if (!isAutoSubmit) {
        const confirmSubmit = confirm('Are you sure you want to submit the test? This action cannot be undone.');
        if (!confirmSubmit) return;
        
        
        this.dialog.open(RatingDialogComponent, {
          width: '400px',
          disableClose: true
        }).afterClosed().subscribe(rating => {
          if (rating) {
            this.isSubmitting = true;
            const answers = this.questions.map(q => ({
                questionId: q.id,
                answer: q.type === 'mcq' ? q.userAnswer : q.userCode
            }));
            
            this.testService.submitTestAnswers(this.testId as number, answers, rating).subscribe({
                next: (result) => {
                    this.router.navigate(['/profile/tests-taken']);
                },
                error: (error) => {
                    console.error('Error submitting test:', error);
                    this.error = 'Failed to submit test. Please try again.';
                    this.isSubmitting = false;
                }
            });
          }
        });
    } else {
        // Auto-submit case
        this.isSubmitting = true;
        const answers = this.questions.map(q => ({
            questionId: q.id,
            answer: q.type === 'mcq' ? q.userAnswer : q.userCode
        }));
        
        // Use neutral rating (3) for auto-submit
        this.testService.submitTestAnswers(this.testId as number, answers, 3).subscribe({
            next: (result) => {
                this.router.navigate(['/profile/tests-taken']);
            },
            error: (error) => {
                console.error('Error submitting test:', error);
                this.error = 'Failed to submit test. Please try again.';
                this.isSubmitting = false;
            }
        });
    }
}
  // Toggle palette visibility for mobile view
  togglePalette(): void {
    this.isPaletteVisible = !this.isPaletteVisible;
  }
}