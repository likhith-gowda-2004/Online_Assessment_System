import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserStats {
  testsCreated: number;
  testsTaken: number;
  rank: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  getUserStats(username: string): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.apiUrl}/${username}/stats`);
  }
}