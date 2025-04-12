import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Topic } from '../models/topic.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private apiUrl = environment.apiUrl;
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

  /**
   * Get all available topics
   */
  getTopics(): Observable<Topic[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Topic[]>(`${this.apiUrl}/topics`, { headers });
  }

  /**
   * Get a specific topic by ID
   */
  getTopicById(id: number): Observable<Topic> {
    const headers = this.getAuthHeaders();
    return this.http.get<Topic>(`${this.apiUrl}/topics/${id}`, { headers });
  }

  /**
   * Get all tests for a specific topic
   */
  getTestsByTopicId(topicId: number): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/topics/${topicId}/tests`, { headers });
  }
}