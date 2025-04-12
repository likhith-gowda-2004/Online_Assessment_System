import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  styles: [`
    :host {
      display: block;
      width: 100%;
      padding: 20px;
    }
    .signup-container {
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
    .login-link {
      text-align: center;
      margin-top: 1rem;
      color: var(--text-secondary);
    }
    .login-link a {
      color: var(--primary-color);
      text-decoration: none;
    }
    .login-link a:hover {
      text-decoration: underline;
    }
    @media (max-width: 480px) {
      .signup-container {
        width: 95%;
        margin: 1rem auto;
        padding: 1rem;
      }
    }
  `],
  template: `
    <div class="signup-container">
      <h2>Sign Up</h2>
      <form (ngSubmit)="onSubmit()" #signupForm="ngForm">
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
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            [(ngModel)]="email" 
            name="email" 
            required 
            #emailInput="ngModel"
            [class.is-invalid]="emailInput.invalid && emailInput.touched"
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
        <button type="submit" [disabled]="signupForm.invalid || isLoading">
          {{isLoading ? 'Signing up...' : 'Sign Up'}}
        </button>
        <p *ngIf="error" class="error">{{error}}</p>
        <p class="login-link">
          Already have an account? <a routerLink="/login">Login</a>
        </p>
      </form>
    </div>
  `
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  error: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.username || !this.email || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authService.signup(this.username, this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isLoading = false;
        this.error = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}