import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

describe('AppComponent', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'getCurrentUser', 'logout']);
    
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should show login button when user is not logged in', () => {
    authServiceSpy.isLoggedIn.and.returnValue(false);
    
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.signin-button')).toBeTruthy();
    expect(compiled.querySelector('.profile-dropdown')).toBeFalsy();
  });

  it('should show profile dropdown when user is logged in', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.getCurrentUser.and.returnValue({ username: 'test', email: 'test@example.com' });
    
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.profile-dropdown')).toBeTruthy();
    expect(compiled.querySelector('.signin-button')).toBeFalsy();
  });

  it('should logout and navigate to login page', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const navigateSpy = spyOn(router, 'navigate');

    app.logout();

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});