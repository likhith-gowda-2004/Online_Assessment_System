import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestService } from '../../../services/test.service';

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface Question {
  type: 'mcq' | 'coding';
  questionText: string;
  options: string[];
  correctAnswer: number;
  testCases: TestCase[];
  marks: number;
  id?: number;
}

@Component({
  selector: 'app-add-questions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-questions.component.html',
  styleUrls: ['./add-questions.component.css']
})
export class AddQuestionsComponent implements OnInit {
  testId!: number;
  testName : string = '';
  questions: Question[] = [];
  loading = false;
  error: string | null = null;
  requiredQuestionCount: number = 0;
  currentCount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private testService: TestService
  ) {}

  ngOnInit(): void {
    const testIdParam = this.route.snapshot.paramMap.get('testId');
    if (!testIdParam) {
      this.router.navigate(['/tests']);
      return;
    }
    this.testId = Number(testIdParam);
    this.getTestInfo();
  }

  async getTestInfo(): Promise<void> {
    try {
      const test = await this.testService.getTestById(this.testId).toPromise();
      if (test) {
        this.requiredQuestionCount = test.questionCount;
        this.testName = test.title;
        // Get current question count
        const countResponse = await this.testService.getQuestionCountForTest(this.testId).toPromise();
        this.currentCount = countResponse && countResponse.count !== undefined ? countResponse.count : 0;
      }
    } catch (error) {
      console.error('Error fetching test info:', error);
    }
  }

  addMCQ(): void {
    this.questions.push({
      type: 'mcq',
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      testCases: [],
      marks: 1
    });
  }

  addCodingQuestion(): void {
    this.questions.push({
      type: 'coding',
      questionText: '',
      options: [],
      correctAnswer: 0,
      testCases: [{ input: '', expectedOutput: '' }],
      marks: 5
    });
  }

  updateOption(questionIndex: number, optionIndex: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && this.questions[questionIndex]) {
      this.questions[questionIndex].options[optionIndex] = input.value;
    }
  }

  addTestCase(question: Question): void {
    if (question.type === 'coding') {
      question.testCases.push({ input: '', expectedOutput: '' });
    }
  }

  removeTestCase(question: Question, index: number): void {
    if (question.type === 'coding' && question.testCases.length > 1) {
      question.testCases.splice(index, 1);
    }
  }

  removeQuestion(index: number): void {
    this.questions.splice(index, 1);
  }

  getOptions(question: Question): string[] {
    return question.options;
  }

  getTestCases(question: Question): TestCase[] {
    return question.testCases;
  }

  trackByIndex(index: number): number {
    return index;
  }

  async saveQuestions(): Promise<void> {
    if (this.questions.length === 0) {
        this.error = 'Please add at least one question.';
        return;
    }

    // Validate questions
    for (const question of this.questions) {
        if (!question.questionText.trim()) {
            this.error = 'All questions must have text';
            return;
        }

        if (question.type === 'mcq') {
            if (question.options.some(opt => !opt.trim())) {
                this.error = 'All MCQ options must be filled';
                return;
            }
        } else if (question.type === 'coding') {
            if (question.testCases.some(tc => !tc.input.trim() || !tc.expectedOutput.trim())) {
                this.error = 'All test cases must have input and expected output';
                return;
            }
        }
    }

    try {
        this.loading = true;
        this.error = null;
        
        // Get test details to check required question count
        const test = await this.testService.getTestById(this.testId).toPromise();
        
        if (!test) {
            throw new Error('Could not retrieve test details');
        }

        // Get current question count
        const countResponse = await this.testService.getQuestionCountForTest(this.testId).toPromise();
        const currentCount = countResponse && countResponse.count !== undefined ? countResponse.count : 0;
        
        // Check if we have enough questions with what's being added now
        const totalAfterAdding = currentCount + this.questions.length;
        
        if (totalAfterAdding < test.questionCount) {
            // Not enough questions - show error and don't save
            const remainingNeeded = test.questionCount - totalAfterAdding;
            this.error = `You need to add ${remainingNeeded} more question(s). The test requires ${test.questionCount} questions total.`;
            this.loading = false;
            return;
        }
        
        // We have enough questions, now save to the database
        console.log('Sending questions to backend:', this.questions);
        const response = await this.testService.addQuestions(this.testId, this.questions).toPromise();
        
        if (response && response.message) {
            console.log('Questions saved successfully:', response);
            // All questions have been added, redirect to tests list
            await this.router.navigate(['/profile/tests-created']);
        } else {
            throw new Error('Invalid response from server');
        }
    } catch (err) {
        console.error('Error saving questions:', err);
        this.error = 'Failed to save questions. Please try again.';
    } finally {
        this.loading = false;
    }
  }
}
