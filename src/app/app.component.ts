import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span routerLink="/" style="cursor: pointer">UofT Resource Hub</span>
      <span style="flex: 1 1 auto"></span>
      
      <!-- Desktop Navigation - Only shown on home page -->
      <div class="desktop-nav" *ngIf="isHomePage">
        <button mat-button (click)="scrollToSection('home')">Home</button>
        <button mat-button (click)="scrollToSection('features')">Features</button>
        <button mat-button (click)="scrollToSection('how-it-works')">How It Works</button>
      </div>

      <button mat-raised-button color="accent">Sign Up</button>

      <!-- Mobile Navigation - Only shown on home page -->
      <button mat-icon-button [matMenuTriggerFor]="mobileMenu" class="mobile-menu-button" *ngIf="isHomePage">
        <mat-icon>menu</mat-icon>
      </button>
      <mat-menu #mobileMenu="matMenu">
        <button mat-menu-item (click)="scrollToSection('home')">
          <mat-icon>home</mat-icon>
          <span>Home</span>
        </button>
        <button mat-menu-item (click)="scrollToSection('features')">
          <mat-icon>featured_play_list</mat-icon>
          <span>Features</span>
        </button>
        <button mat-menu-item (click)="scrollToSection('how-it-works')">
          <mat-icon>help_outline</mat-icon>
          <span>How It Works</span>
        </button>
        <button mat-menu-item>
          <mat-icon>person_add</mat-icon>
          <span>Sign Up</span>
        </button>
      </mat-menu>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: [`
    mat-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background-color: #002A5C !important;
      padding: 0 16px;
      height: 64px;
    }
    
    .desktop-nav {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .mobile-menu-button {
      display: none;
      margin-left: 16px;
    }
    
    button[color="accent"] {
      background-color: #E31837 !important;
      margin-left: 16px;
    }

    @media (max-width: 768px) {
      .desktop-nav {
        display: none;
      }

      .mobile-menu-button {
        display: block;
      }
    }
  `]
})
export class AppComponent {
  isHomePage = false;

  constructor(private router: Router) {
    // Subscribe to router events to detect current route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isHomePage = event.url === '/' || event.url === '/home';
    });
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}


