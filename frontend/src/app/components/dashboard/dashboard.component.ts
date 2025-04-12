import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styles: [`
    .hero {
      background: linear-gradient(135deg, #1a90ff 0%, #1451cc 100%);
      padding: 6rem 2rem;
      text-align: center;
      color: white;
    }

    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .hero-title {
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 1.5rem;
    }

    .hero-subtitle {
      font-size: clamp(1rem, 2vw, 1.25rem);
      opacity: 0.9;
      margin-bottom: 2rem;
    }

    .hero-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-primary {
      padding: 1rem 2rem;
      font-size: 1.1rem;
      background-color: white;
      color: var(--primary-color);
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-secondary {
      padding: 1rem 2rem;
      font-size: 1.1rem;
      background-color: transparent;
      color: white;
      border: 2px solid white;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary:hover,
    .btn-secondary:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }

    .features {
      padding: 6rem 2rem;
      background-color: #282828;
    }

    .section-title {
      text-align: center;
      font-size: clamp(1.5rem, 3vw, 2.5rem);
      margin-bottom: 4rem;
      color: white;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .feature-card {
      background: #333;
      padding: 2.5rem;
      border-radius: 16px;
      text-align: center;
      transition: all 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    .feature-icon {
      width: 64px;
      height: 64px;
      margin-bottom: 1.5rem;
      color: var(--primary-color);
    }

    .feature-title {
      font-size: 1.5rem;
      color: white;
      margin-bottom: 1rem;
    }

    .feature-description {
      color: #b3b3b3;
      line-height: 1.6;
      font-size: 1.1rem;
    }

    .testimonials {
      padding: 6rem 2rem;
      background-color: #1a1a1a;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .testimonial-card {
      background: #282828;
      padding: 2rem;
      border-radius: 12px;
      position: relative;
    }

    .testimonial-text {
      color: #ffffff;
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .author-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: var(--primary-color);
    }

    .author-info {
      color: #ffffff;
    }

    .author-name {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .author-role {
      color: #b3b3b3;
      font-size: 0.9rem;
    }

    .footer {
      background-color: #282828;
      padding: 4rem 2rem 2rem;
      color: #b3b3b3;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 3rem;
    }

    .footer-section h3 {
      color: white;
      margin-bottom: 1.5rem;
      font-size: 1.2rem;
    }

    .footer-links {
      list-style: none;
      padding: 0;
    }

    .footer-links li {
      margin-bottom: 1rem;
    }

    .footer-links a {
      color: #b3b3b3;
      text-decoration: none;
      transition: color 0.2s;
      font-size: 1rem;
    }

    .footer-links a:hover {
      color: var(--primary-color);
    }

    .copyright {
      text-align: center;
      padding-top: 2rem;
      margin-top: 2rem;
      border-top: 1px solid #404040;
      color: #666;
    }

    @media (max-width: 768px) {
      .hero {
        padding: 4rem 1rem;
      }

      .features,
      .testimonials {
        padding: 4rem 1rem;
      }

      .feature-card,
      .testimonial-card {
        padding: 1.5rem;
      }

      .footer {
        padding: 3rem 1rem 1.5rem;
      }
    }
  `],
  template: `
    <div class="dashboard">
      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">Transform Your Assessment Process</h1>
          <p class="hero-subtitle">Create, manage, and analyze assessments with our powerful and intuitive platform</p>
          <div class="hero-buttons">
            <button class="btn-primary" routerLink="/tests/create">Create Assessment</button>
            <button class="btn-secondary" routerLink="/explore">Explore Tests</button>
          </div>
        </div>
      </section>

      <section class="features">
        <h2 class="section-title">Why Choose Our Platform?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <h3 class="feature-title">Advanced Assessment Tools</h3>
            <p class="feature-description">Create professional tests with our intuitive builder and comprehensive question bank</p>
          </div>

          <div class="feature-card">
            <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h3 class="feature-title">Real-time Analytics</h3>
            <p class="feature-description">Get instant insights with detailed performance analytics and progress tracking</p>
          </div>

          <div class="feature-card">
            <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
            <h3 class="feature-title">24/7 Expert Support</h3>
            <p class="feature-description">Get dedicated assistance from our expert support team whenever you need it</p>
          </div>
        </div>
      </section>

      <section class="testimonials">
        <h2 class="section-title">What Our Users Say</h2>
        <div class="testimonials-grid">
          <div class="testimonial-card">
            <p class="testimonial-text">"This platform has revolutionized how we conduct assessments. The analytics are incredibly helpful."</p>
            <div class="testimonial-author">
              <div class="author-avatar"></div>
              <div class="author-info">
                <div class="author-name">Sarah Johnson</div>
                <div class="author-role">HR Manager</div>
              </div>
            </div>
          </div>

          <div class="testimonial-card">
            <p class="testimonial-text">"The ease of creating and managing tests has made our recruitment process much more efficient."</p>
            <div class="testimonial-author">
              <div class="author-avatar"></div>
              <div class="author-info">
                <div class="author-name">Michael Chen</div>
                <div class="author-role">Technical Lead</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer class="footer">
        <div class="footer-content">
          <div class="footer-section">
            <h3>Product</h3>
            <ul class="footer-links">
              <li><a routerLink="/features">Features</a></li>
              <li><a routerLink="/pricing">Pricing</a></li>
              <li><a routerLink="/case-studies">Case Studies</a></li>
              <li><a routerLink="/reviews">Reviews</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h3>Resources</h3>
            <ul class="footer-links">
              <li><a routerLink="/blog">Blog</a></li>
              <li><a routerLink="/docs">Documentation</a></li>
              <li><a routerLink="/help">Help Center</a></li>
              <li><a routerLink="/api">API</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h3>Company</h3>
            <ul class="footer-links">
              <li><a routerLink="/about">About Us</a></li>
              <li><a routerLink="/careers">Careers</a></li>
              <li><a routerLink="/contact">Contact</a></li>
              <li><a routerLink="/privacy">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div class="copyright">
          © {{currentYear}} Online Assessment System. All rights reserved.
        </div>
      </footer>
    </div>
  `
})
export class DashboardComponent {
  currentYear = new Date().getFullYear();
}

