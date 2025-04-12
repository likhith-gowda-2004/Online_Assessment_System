import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { ExploreComponent } from './components/explore/explore.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TestListComponent } from './components/test/test-list/test-list.component';
import { UserSettingsComponent } from './components/profile/user-settings/user-settings.component';
import { UserStatsComponent } from './components/profile/user-stats/user-stats.component';
import { ExploreTopicComponent } from './components/explore/explore-topic/explore-topic.component';
import { CreateTestComponent } from './components/test/create-test/create-test.component';
import { AddQuestionsComponent } from './components/test/create-test/add-questions.component';
import { TestInstructionsComponent } from './components/test/test-instructions/test-instructions.component';
import { TakeTestComponent } from './components/test/take-test/take-test.component';
import { TestsTakenComponent } from './components/test/tests-taken/tests-taken.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'explore', component: ExploreComponent },
  { path: 'tests/create', component: CreateTestComponent},
  { path: 'tests/:testId/add-questions', component: AddQuestionsComponent },
  { 
    path: 'explore/:id', 
    component: ExploreTopicComponent 
  },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/settings', component: UserSettingsComponent },
  { path: 'profile/tests-created', component: TestListComponent },
  { path: 'profile/tests-taken', component: TestsTakenComponent },
  { path: 'profile/stats', component: UserStatsComponent },
  { path: 'test/:id/instructions', component: TestInstructionsComponent },
  { path: 'test/:id/take', component: TakeTestComponent },
  { path: 'test/:id', redirectTo: 'test/:id/instructions', pathMatch: 'full' },
  { path: 'leaderboard/:testId', component: LeaderboardComponent },
];