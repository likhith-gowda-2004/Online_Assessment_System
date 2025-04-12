import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { Test } from '../models/test.interface';
import { TestQuestion } from '../models/TestQuestion.interface';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private apiUrl = 'http://localhost:8080/api';
  private isBrowser: boolean;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private getAuthHeaders(): HttpHeaders {
    let token = '';
    if (this.isBrowser) {
      token = localStorage.getItem('token') || '';
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getTestsByTopicId(topicId: string): Observable<Test[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Test[]>(`${this.apiUrl}/topics/${topicId}/tests`, { headers });
  }

  getTestById(id: number): Observable<Test> {
    const headers = this.getAuthHeaders();
    return this.http.get<Test>(`${this.apiUrl}/tests/${id}`, { headers });
  }

  createTest(test: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/tests/create`, test, { headers });
  }

  getTopics(): Observable<{ id: number; name: string }[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<{ id: number; name: string }[]>(`${this.apiUrl}/topics`, { headers });
  }

  getQuestionCountForTest(testId: number): Observable<{count: number}> {
    const headers = this.getAuthHeaders();
    return this.http.get<{count: number}>(`${this.apiUrl}/tests/${testId}/questions/count`, { headers });
  }

  // Add this missing method
  getCreatedTests(): Observable<Test[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Test[]>(`${this.apiUrl}/tests/created`, { headers });
  }
  
  addQuestions(testId: number, questions: any[]): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('Sending questions:', questions); // Debug log
    return this.http.post<{message: string}>(
        `${this.apiUrl}/tests/${testId}/questions`, 
        questions, 
        { headers }
    ).pipe(
        catchError(error => {
            console.error('Error adding questions:', error);
            throw error;
        })
    );
  }
  getTestQuestions(testId: number): Observable<TestQuestion[]> {
    console.log(`Requesting questions for test ID: ${testId}`);
    const headers = this.getAuthHeaders();
    console.log('Auth headers:', headers);
    
    return this.http.get<TestQuestion[]>(`${this.apiUrl}/tests/${testId}/questions`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching test questions:', error);
        throw error;
      })
    );
  }
  
  submitTestAnswers(testId: number, answers: any[], rating: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/tests/${testId}/submit`, 
      { 
        answers,
        rating 
      }, 
      { headers }
    ).pipe(
      tap(response => console.log('Test submission response:', response)),
      catchError(error => {
        console.error('Error submitting test:', error);
        throw error;
      })
    );
  }  
  // Add this method to your existing TestService
  getTestSubmissions(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    console.log('Fetching test submissions with headers:', headers);
    return this.http.get<any[]>(`${this.apiUrl}/tests/submissions`, { headers }).pipe(
      tap(data => console.log('Received test submissions:', data)),
      catchError(error => {
        console.error('Error details:', error);
        throw error;
      })
    );
  }

  submitTestFeedback(testId: number, rating: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/tests/${testId}/feedback`, { rating });
  }

}