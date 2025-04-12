import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  styles: [`
    :host {
      display: block;
      width: 100%;
      padding: 20px;
    }
    .login-container {
      max-width: 400px;
      width: 90%;
      margin: 2rem auto;
      padding: 2rem;
      border: 1px solid var(--border);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      background: var(--surface);
      color: var(--text-primary);
    }
    h2 {
      color: var(--text-primary);
      margin-bottom: 1.5rem;
      text-align: center;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--text-primary);
    }
    input {
      width: 100%;
      padding: 0.75rem;
      background-color: #333;
      border: 1px solid var(--border);
      border-radius: 4px;
      font-size: 1rem;
      color: var(--text-primary);
      transition: border-color 0.2s;
    }
    input:focus {
      outline: none;
      border-color: var(--primary-color);
    }
    input.is-invalid {
      border-color: #dc3545;
    }
    button {
      width: 100%;
      padding: 0.75rem;
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
    }
    button:hover {
      background-color: var(--primary-hover);
    }
    button:disabled {
      background-color: #555;
      cursor: not-allowed;
    }
    .error {
      color: #ff4444;
      margin-top: 0.5rem;
      padding: 0.5rem;
      background-color: rgba(220, 53, 69, 0.1);
      border-radius: 4px;
      border: 1px solid rgba(220, 53, 69, 0.2);
    }
    .signup-link {
      text-align: center;
      margin-top: 1rem;
      color: var(--text-secondary);
    }
    .signup-link a {
      color: var(--primary-color);
      text-decoration: none;
    }
    .signup-link a:hover {
      text-decoration: underline;
    }
    @media (max-width: 480px) {
      .login-container {
        width: 95%;
        margin: 1rem auto;
        padding: 1rem;
      }
    }
  `],
  // ... rest of the component code remains the same
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
        <div class="form-group">
          <label for="username">Username</label>
          <input 
            type="text" 
            id="username" 
            [(ngModel)]="username" 
            name="username" 
            required 
            #usernameInput="ngModel"
            [class.is-invalid]="usernameInput.invalid && usernameInput.touched"
          >
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            [(ngModel)]="password" 
            name="password" 
            required
            #passwordInput="ngModel"
            [class.is-invalid]="passwordInput.invalid && passwordInput.touched"
          >
        </div>
        <button type="submit" [disabled]="loginForm.invalid || isLoading">
          {{isLoading ? 'Logging in...' : 'Login'}}
        </button>
        <p *ngIf="error" class="error">{{error}}</p>
        <p class="signup-link">
          Don't have an account? <a routerLink="/signup">Sign up</a>
        </p>
      </form>
    </div>
  `
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.username || !this.password) {
      this.error = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.error = error.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}