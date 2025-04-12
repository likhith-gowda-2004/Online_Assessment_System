import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TestService } from '../../../services/test.service';

@Component({
  selector: 'app-create-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.css']
})
export class CreateTestComponent implements OnInit {
  test = {
    title: '',
    topicId: 0,
    durationMinutes: null,
    questionCount: null,
    difficultyLevel: 'BEGINNER',
    description: ''
  };

  topics: { id: number; name: string }[] = []; // Define topics array

  constructor(private testService: TestService) {}

  ngOnInit() {
    // Fetch topics from the backend
    this.testService.getTopics().subscribe(
      (data) => {
        this.topics = data; // Assign the fetched data to the topics array
      },
      (error) => {
        console.error('Error fetching topics:', error);
      }
    );
  }

  onSubmit() {
    if (!this.test.topicId) {
      alert('Please select a valid topic.');
      return;
    }
    this.test.topicId = Number(this.test.topicId);
  
    console.log('Test data being sent:', this.test); // Log the entire test object for debugging
  
    this.testService.createTest(this.test).subscribe(
      (response: any) => {
        alert('Test created successfully!');
        const testId = response; // Assuming the backend returns the test ID
        // Redirect to the Add Questions page
        window.location.href = `/tests/${testId}/add-questions`;
      },
      (error) => {
        console.error('Error creating test:', error);
        alert('Failed to create test.');
      }
    );
  }
}