import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatProgressBarModule,
        RouterModule
    ],
    template: `
    <div class="auth-container" [class.dark-theme]="isDarkTheme">
      <div class="auth-content">
        <div class="logo-section">
          <div class="logo-circle">
            <mat-icon>school</mat-icon>
          </div>
          <h1>Resource Hub</h1>
        </div>
        
        <mat-card class="auth-card" [class.dark-theme]="isDarkTheme">
          <mat-progress-bar *ngIf="isLoading" mode="indeterminate" class="progress-bar"></mat-progress-bar>
          
          <mat-card-header>
            <mat-card-title>Log In</mat-card-title>
            <mat-card-subtitle>Welcome back! Please log in to your account</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <div class="form-icon">
              <mat-icon>login</mat-icon>
            </div>
            <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
              <mat-form-field appearance="outline" class="full-width" [class.dark-theme]="isDarkTheme">
                <mat-label [style.color]="isDarkTheme ? 'white' : 'black'">UofT Email</mat-label>
                <input matInput type="email" formControlName="email" placeholder="yourname@mail.utoronto.ca"
                       [style.border-color]="isDarkTheme ? 'white' : 'black'"
                       [style.color]="isDarkTheme ? 'white' : 'black'">
                <mat-icon matSuffix [style.color]="isDarkTheme ? 'white' : 'rgba(0, 0, 0, 0.54)'">alternate_email</mat-icon>
                <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                  Email is required
                </mat-error>
                <mat-error *ngIf="loginForm.get('email')?.hasError('pattern')">
                  Please enter a valid UofT email address
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width" [class.dark-theme]="isDarkTheme">
                <mat-label [style.color]="isDarkTheme ? 'white' : 'black'">Password</mat-label>
                <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" 
                   [style.border-color]="isDarkTheme ? 'white' : 'black'"
                   [style.color]="isDarkTheme ? 'white' : 'black'">
                <mat-icon matSuffix (click)="hidePassword = !hidePassword" [style.color]="isDarkTheme ? 'white' : 'rgba(0, 0, 0, 0.54)'">
                  {{hidePassword ? 'visibility_off' : 'visibility'}}
                </mat-icon>
                <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                  Password is required
                </mat-error>
              </mat-form-field>

              <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid || isLoading" class="submit-button">
                <span>Log In</span>
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </form>
          </mat-card-content>

          <mat-card-actions>
            <p class="auth-link">
              Don't have an account? <a routerLink="/signup">Sign up</a>
            </p>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
    styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 24px;
      background: linear-gradient(135deg, #002A5C 0%, #8EABD0 100%);
      transition: all 0.3s ease;

      &.dark-theme {
        background: linear-gradient(135deg, #001A3C 0%, #1E3A5F 100%);
      }
    }

    .auth-content {
      width: 100%;
      max-width: 440px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 32px;
    }

    .logo-section {
      text-align: center;
      color: white;

      .logo-circle {
        width: 80px;
        height: 80px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        margin: 0 auto 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;

        mat-icon {
          font-size: 40px;
          width: 40px;
          height: 40px;
          color: white;
        }

        &:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }
      }

      h1 {
        font-size: 28px;
        margin: 0;
        font-weight: 300;
        letter-spacing: 1px;
      }
    }

    .auth-card {
      width: 100%;
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      position: relative;
      overflow: hidden;
      background-color: white;
      transition: all 0.3s ease;

      &.dark-theme {
        background-color: #1E1E1E;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

        mat-card-title {
          color: #8EABD0;
        }

        mat-card-subtitle {
          color: rgba(255, 255, 255, 0.7);
        }

        ::ng-deep {
          .mat-mdc-form-field {
            .mdc-text-field {
              background-color: #2D2D2D;
            }

            .mdc-floating-label,
            .mdc-floating-label--float-above {
              color: rgba(255, 255, 255, 0.7) !important;
            }

            .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input {
              color: white !important;
            }

            input::placeholder {
              color: rgba(255, 255, 255, 0.5) !important;
            }

            .mdc-notched-outline__leading,
            .mdc-notched-outline__notch,
            .mdc-notched-outline__trailing {
              border-color: rgba(255, 255, 255, 0.7) !important;
            }

            &:hover .mdc-notched-outline__leading,
            &:hover .mdc-notched-outline__notch,
            &:hover .mdc-notched-outline__trailing {
              border-color: white !important;
            }

            &.mdc-text-field--focused {
              .mdc-notched-outline__leading,
              .mdc-notched-outline__notch,
              .mdc-notched-outline__trailing {
                border-color: #8EABD0 !important;
                border-width: 2px;
              }

              .mdc-floating-label,
              .mdc-floating-label--float-above {
                color: #8EABD0 !important;
              }
            }

            .mat-mdc-form-field-icon-suffix {
              color: rgba(255, 255, 255, 0.7);
            }

            [matSuffix] {
              color: rgba(255, 255, 255, 0.7) !important;
              cursor: pointer;

              &:hover {
                color: white !important;
              }
            }
          }
        }

        .auth-link {
          color: rgba(255, 255, 255, 0.7);
          
          a {
            color: #8EABD0;
          }
        }

        .form-icon {
          background-color: #2D2D2D;
          
          mat-icon {
            color: white;
          }
        }

        .submit-button {
          background-color: #8EABD0;

          span, mat-icon {
            color: white;
          }

          &:hover:not([disabled]) {
            background-color: lighten(#8EABD0, 10%);
          }

          &[disabled] {
            background-color: rgba(255, 255, 255, 0.12);
            
            span, mat-icon {
              color: rgba(255, 255, 255, 0.3);
            }
          }
        }
      }
    }

    .progress-bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }

    mat-card-header {
      text-align: center;
      display: block;
      margin-bottom: 32px;

      mat-card-title {
        font-size: 24px;
        margin-bottom: 8px;
        color: #002A5C;
      }

      mat-card-subtitle {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.6);
      }
    }

    .form-icon {
      width: 64px;
      height: 64px;
      background-color: #F5F5F5;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      transition: all 0.3s ease;

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: #002A5C;
      }
    }

    .full-width {
      width: 100%;
      margin-bottom: 24px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .submit-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 8px 24px;
      font-size: 16px;
      background-color: #002A5C;
      transition: all 0.3s ease;

      &:hover:not([disabled]) {
        background-color: darken(#002A5C, 5%);
        transform: translateY(-2px);
      }

      &[disabled] {
        background-color: rgba(0, 0, 0, 0.12);
        
        span, mat-icon {
          color: rgba(0, 0, 0, 0.38);
        }
      }

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }

    .auth-link {
      text-align: center;
      margin: 16px 0 0;
      color: rgba(0, 0, 0, 0.6);

      a {
        color: #002A5C;
        text-decoration: none;
        font-weight: 500;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    @media (max-width: 480px) {
      .auth-container {
        padding: 16px;
      }

      .auth-card {
        padding: 24px;
      }

      .logo-section {
        .logo-circle {
          width: 64px;
          height: 64px;

          mat-icon {
            font-size: 32px;
            width: 32px;
            height: 32px;
          }
        }

        h1 {
          font-size: 24px;
        }
      }

      mat-card-header {
        mat-card-title {
          font-size: 20px;
        }

        mat-card-subtitle {
          font-size: 14px;
        }
      }
    }
  `]
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm: FormGroup;
    isLoading = false;
    isDarkTheme = false;
    hidePassword = true;
    private themeSubscription = new Subscription();

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private themeService: ThemeService
    ) {
        this.loginForm = this.fb.group({
            email: ['', [
                Validators.required,
                Validators.pattern('^[a-zA-Z0-9._%+-]+@(mail\\.)?utoronto\\.ca$')
            ]],
            password: ['', [
                Validators.required
            ]]
        });
    }

    ngOnInit() {
        this.themeSubscription = this.themeService.darkMode$.subscribe(
            (isDark: boolean) => this.isDarkTheme = isDark
        );
    }

    ngOnDestroy() {
        this.themeSubscription.unsubscribe();
    }

    onLogin() {
        if (this.loginForm.valid) {
            this.isLoading = true;
            // TODO: Call backend API to authenticate
            setTimeout(() => {
                this.isLoading = false;
                this.router.navigate(['/courses']);
            }, 1500);
        }
    }
} 