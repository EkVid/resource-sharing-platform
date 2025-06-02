import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
    { path: 'verification', loadComponent: () => import('./pages/verification/verification.component').then(m => m.VerificationComponent) },
    { path: 'courses', loadComponent: () => import('./pages/courses/courses.component').then(m => m.CoursesComponent) },
    { path: 'signup', loadComponent: () => import('./pages/auth/signup/signup.component').then(m => m.SignupComponent) },
    { path: 'login', loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) }
];
