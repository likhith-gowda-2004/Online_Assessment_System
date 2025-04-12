import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUser: any = null;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.currentUser = this.getUserFromStorage();
    }
  }

  signup(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, {
      username,
      email,
      password
    });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, {
      username,
      password
    }).pipe(
      tap(response => {
        this.setToken(response.token); // Store the token
        localStorage.setItem('token',response.token);
        this.currentUser = { username }; // Optionally store the username in memory
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      this.removeToken(); // Remove the token
    }
    this.currentUser = null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken(); // Check if a token exists
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  private getUserFromStorage(): any {
    if (this.isBrowser) {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  private setCurrentUser(user: any): void {
    this.currentUser = user;
    if (this.isBrowser) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
  private setToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem('token', token);
    }
  }
  
  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('token');
    }
    return null;
  }
  
  private removeToken(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
    }
  }
}