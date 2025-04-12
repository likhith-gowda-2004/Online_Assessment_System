import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink,Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { ClickOutsideDirective } from './shared/directives/click-outside.directive';
import { ExploreDropdownComponent } from './components/explore/explore-dropdown.component';
import { UserService } from './services/user.service';
interface UserStats {
  testsCreated: number;
  testsTaken: number;
  rank: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink,ClickOutsideDirective, ExploreDropdownComponent],
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #1a1a1a;
      color: #ffffff;
    }

    .app-container {
      min-height: 100vh;
    }

    .navbar {
      display: flex;
      align-items: center;
      padding: 0.75rem 2rem;
      background-color: #282828;
      border-bottom: 1px solid #404040;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      color: #ffffff;
      text-decoration: none;
      margin-right: 2rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .nav-links {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    .nav-link {
      color: #b3b3b3;
      text-decoration: none;
      font-size: 1rem;
      transition: color 0.2s;
      padding: 0.5rem;
      border-radius: 4px;
    }

    .nav-link:hover {
      color: #ffffff;
      background-color: #404040;
    }

    .spacer {
      flex: 1;
    }

    .profile-section {
      display: flex;
      align-items: center;
      gap: 1rem;
      position: relative;
    }

    .profile-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #404040;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .profile-icon:hover {
      background-color: #505050;
    }

    .signin-button {
      padding: 0.5rem 1rem;
      background-color: #1a90ff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .signin-button:hover {
      background-color: #40a9ff;
      transform: translateY(-1px);
    }

    .profile-dropdown {
      position: relative;
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      width: 280px;
      background-color: #282828;
      border: 1px solid #404040;
      border-radius: 8px;
      padding: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      opacity: 0;
      transform: translateY(-10px);
      transition: all 0.2s;
    }

    .dropdown-menu.show {
      opacity: 1;
      transform: translateY(0);
    }

    .dropdown-header {
      padding: 1rem;
      border-bottom: 1px solid #404040;
    }

    .user-name {
      font-weight: 500;
      color: #ffffff;
      margin-bottom: 0.25rem;
      font-size: 1.1rem;
    }

    .user-email {
      font-size: 0.875rem;
      color: #b3b3b3;
    }

    .stats {
      display: flex;
      justify-content: space-between;
      padding: 1rem;
      border-bottom: 1px solid #404040;
      background-color: #323232;
      border-radius: 4px;
      margin: 0.5rem 0;
    }

    .stat-item {
      text-align: center;
    }

    .stat-value {
      font-weight: 600;
      color: #ffffff;
      font-size: 1.1rem;
    }

    .stat-label {
      font-size: 0.75rem;
      color: #b3b3b3;
      margin-top: 0.25rem;
    }

    .dropdown-items {
      padding: 0.5rem 0;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .dropdown-item:hover {
      background-color: #404040;
      transform: translateX(4px);
    }

    .dropdown-item svg {
      width: 18px;
      height: 18px;
      color: #b3b3b3;
    }

    .nav-item {
      position: relative;
    }

    .explore-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
    color: #b3b3b3;
  }

    .explore-link:hover {
    color: #ffffff;
    background-color: #404040;
  }

     app-explore-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 0.5rem;
    visibility: hidden;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    z-index: 1000;
  }
    .nav-item:hover app-explore-dropdown {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }
  `],
  template: `
    <div class="app-container">
      <nav class="navbar">
        <a routerLink="/dashboard" class="logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          OAS
        </a>
        
        <div class="nav-links">
          <div class="nav-item">
        <a class="explore-link">
          Explore
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          <app-explore-dropdown></app-explore-dropdown>
        </a>
      </div>
      <a routerLink="/about" class="nav-link">About</a>
      <a routerLink="/contact" class="nav-link">Contact</a>
          
        </div>
        
        <div class="spacer"></div>
        
        <div class="profile-section">
          <ng-container *ngIf="isLoggedIn(); else loginButton">
            <div class="profile-dropdown" (clickOutside)="hideDropdown()">
              <div class="profile-icon" (click)="toggleDropdown()" [attr.aria-expanded]="showDropdown">
                {{ getUserInitials() }}
              </div>
              <div class="dropdown-menu" [class.show]="showDropdown" *ngIf="showDropdown">
                <div class="dropdown-header">
                  <div class="user-name">{{ getCurrentUser()?.username }}</div>
                  <div class="user-email">{{ getCurrentUser()?.email }}</div>
                </div>
                
                <div class="stats">
                  <div class="stat-item">
                    <div class="stat-value">{{ userStats.testsCreated }}</div>
                    <div class="stat-label">Created</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">{{ userStats.testsTaken }}</div>
                    <div class="stat-label">Taken</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">#{{ userStats.rank }}</div>
                    <div class="stat-label">Rank</div>
                  </div>
                </div>
                
                <div class="dropdown-items">
                  <a routerLink="/profile/tests-created" class="dropdown-item" (click)="hideDropdown()">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Tests Created
                  </a>
                  
                  <a routerLink="/profile/tests-taken" class="dropdown-item" (click)="hideDropdown()">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Tests Taken
                  </a>
                  
                  <a routerLink="/profile/stats" class="dropdown-item" (click)="hideDropdown()">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 20V10"></path>
                      <path d="M18 20V4"></path>
                      <path d="M6 20v-4"></path>
                    </svg>
                    Overall Stats
                  </a>
                  
                  <a routerLink="/profile/settings" class="dropdown-item" (click)="hideDropdown()">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    Settings
                  </a>
                  <a (click)="logout()" class="dropdown-item">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
    Logout
  </a>
                </div>
              </div>
            </div>
          </ng-container>
          <ng-template #loginButton>
            <button class="signin-button" routerLink="/login">Sign In</button>
          </ng-template>
        </div>
      </nav>
      
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent implements OnInit {
  showDropdown = false;
  userStats: UserStats = {
    testsCreated: 0,
    testsTaken: 0,
    rank: 0
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.hideDropdown();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.loadUserStats();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getCurrentUser(): any {
    return this.authService.getCurrentUser();
  }

  getUserInitials(): string {
    const user = this.getCurrentUser();
    return user ? user.username.charAt(0).toUpperCase() : '';
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  hideDropdown(): void {
    this.showDropdown = false;
  }

  private loadUserStats(): void {
    if (this.isLoggedIn()) {
      const user = this.getCurrentUser();
      if (user) {
        this.userService.getUserStats(user.username).subscribe({
          next: (stats) => {
            this.userStats = stats;
          },
          error: (error) => {
            console.error('Error loading user stats:', error);
          }
        });
      }
    }
  }
}