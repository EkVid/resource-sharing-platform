import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-verification',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatProgressBarModule
    ],
    template: `
    <div class="verification-container" [class.dark-theme]="isDarkTheme">
      <div class="verification-content">
        <div class="logo-section">
          <div class="logo-circle">
            <mat-icon>school</mat-icon>
          </div>
          <h1>Resource Hub</h1>
        </div>
        
        <mat-card class="verification-card" [class.dark-theme]="isDarkTheme">
          <mat-progress-bar *ngIf="isLoading" mode="indeterminate" class="progress-bar"></mat-progress-bar>
          
          <mat-card-header>
            <mat-card-title>Email Verification</mat-card-title>
            <mat-card-subtitle>Please verify your UofT email to access resources</mat-card-subtitle>
          </mat-card-header>

          <!-- Email Form -->
          <mat-card-content *ngIf="!isCodeSent" [class.dark-theme]="isDarkTheme">
            <div class="form-icon">
              <mat-icon>mail_outline</mat-icon>
            </div>
            <form [formGroup]="emailForm" (ngSubmit)="sendVerificationCode()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label [style.color]="isDarkTheme ? 'white' : 'black'">UofT Email</mat-label>
                <input matInput type="email" formControlName="email" placeholder="yourname@mail.utoronto.ca"
                       [style.border-color]="isDarkTheme ? 'white' : 'black'">
                <mat-icon matSuffix [style.color]="isDarkTheme ? 'white' : 'black'">alternate_email</mat-icon>
                <mat-error *ngIf="emailForm.get('email')?.hasError('required')">
                  Email is required
                </mat-error>
                <mat-error *ngIf="emailForm.get('email')?.hasError('pattern')">
                  Please enter a valid UofT email address
                </mat-error>
              </mat-form-field>
              <button mat-raised-button color="primary" type="submit" [disabled]="emailForm.invalid || isLoading" class="submit-button">
                <span>Send Verification Code</span>
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </form>
          </mat-card-content>

          <!-- Code Verification Form -->
          <mat-card-content *ngIf="isCodeSent" class="verification-step">
            <div class="form-icon">
              <mat-icon>lock_outline</mat-icon>
            </div>
            <p class="email-sent-message">
              We've sent a verification code to<br>
              <strong>{{emailForm.get('email')?.value}}</strong>
            </p>
            <form [formGroup]="codeForm" (ngSubmit)="verifyCode()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Verification Code</mat-label>
                <input matInput formControlName="code" placeholder="Enter 6-digit code" maxlength="6">
                <mat-icon matSuffix>pin</mat-icon>
                <mat-error *ngIf="codeForm.get('code')?.hasError('required')">
                  Verification code is required
                </mat-error>
                <mat-error *ngIf="codeForm.get('code')?.hasError('pattern')">
                  Please enter a valid 6-digit code
                </mat-error>
              </mat-form-field>
              <div class="verification-actions">
                <button mat-raised-button color="primary" type="submit" [disabled]="codeForm.invalid || isLoading" class="submit-button">
                  <span>Verify Code</span>
                  <mat-icon>check_circle</mat-icon>
                </button>
                <button mat-button type="button" (click)="resendCode()" [disabled]="isLoading" class="resend-button">
                  <mat-icon>refresh</mat-icon>
                  <span>Resend Code</span>
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
    styles: [`
    .verification-container {
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

    .verification-content {
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

    .verification-card {
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

        .mat-mdc-form-field {
          .mdc-text-field {
            background-color: rgba(0, 42, 92, 0.3) !important;
          }

          .mdc-floating-label {
            color: white !important;
          }

          .mdc-floating-label--float-above {
            color: white !important;
          }

          input {
            color: white !important;
          }

          .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input {
            color: white;
          }

          .mat-mdc-form-field-icon-suffix {
            color: white;
          }

          input::placeholder {
            color: rgba(255, 255, 255, 0.7) !important;
          }

          .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,
          .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,
          .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {
            border-color: white !important;
            border-width: 1px !important;
          }

          .mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline__leading,
          .mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline__notch,
          .mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline__trailing {
            border-color: white !important;
            border-width: 2px !important;
          }

          .mdc-text-field--outlined.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,
          .mdc-text-field--outlined.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,
          .mdc-text-field--outlined.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {
            border-color: #8EABD0 !important;
            border-width: 2px !important;
          }

          [matSuffix] {
            color: white !important;
          }
        }

        .email-sent-message {
          color: rgba(255, 255, 255, 0.9);
          
          strong {
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

        .resend-button {
          color: #8EABD0;

          &[disabled] {
            color: rgba(255, 255, 255, 0.3);
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

    :host ::ng-deep {
      .dark-theme {
        .mat-mdc-form-field-focus-overlay {
          background-color: transparent;
        }
        
        .mdc-text-field--outlined:not(.mdc-text-field--disabled) {
          .mdc-notched-outline__leading,
          .mdc-notched-outline__notch,
          .mdc-notched-outline__trailing {
            border-color: white !important;
          }
        }

        .mdc-text-field--outlined.mdc-text-field--focused:not(.mdc-text-field--disabled) {
          .mdc-notched-outline__leading,
          .mdc-notched-outline__notch,
          .mdc-notched-outline__trailing {
            border-color: white !important;
            border-width: 2px !important;
          }
        }
      }
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .email-sent-message {
      text-align: center;
      margin-bottom: 24px;
      color: rgba(0, 0, 0, 0.87);
      line-height: 1.5;

      strong {
        color: #002A5C;
        display: block;
        margin-top: 8px;
      }
    }

    .verification-actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
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

    .resend-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #002A5C;

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    @media (max-width: 480px) {
      .verification-container {
        padding: 16px;
      }

      .verification-card {
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
export class VerificationComponent implements OnInit, OnDestroy {
    emailForm: FormGroup;
    codeForm: FormGroup;
    isCodeSent = false;
    isLoading = false;
    isDarkTheme = false;
    private themeSubscription = new Subscription();

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private themeService: ThemeService
    ) {
        this.emailForm = this.fb.group({
            email: ['', [
                Validators.required,
                Validators.pattern('^[a-zA-Z0-9._%+-]+@(mail\\.)?utoronto\\.ca$')
            ]]
        });

        this.codeForm = this.fb.group({
            code: ['', [
                Validators.required,
                Validators.pattern('^[0-9]{6}$')
            ]]
        });
    }

    ngOnInit() {
        this.themeSubscription = this.themeService.darkMode$.subscribe(
            isDark => this.isDarkTheme = isDark
        );
    }

    ngOnDestroy() {
        this.themeSubscription.unsubscribe();
    }

    sendVerificationCode() {
        if (this.emailForm.valid) {
            this.isLoading = true;
            // TODO: Call backend API to send verification code
            setTimeout(() => {
                this.isLoading = false;
                this.isCodeSent = true;
            }, 1500);
        }
    }

    verifyCode() {
        if (this.codeForm.valid) {
            this.isLoading = true;
            // TODO: Call backend API to verify code
            setTimeout(() => {
                this.isLoading = false;
                this.router.navigate(['/courses']);
            }, 1500);
        }
    }

    resendCode() {
        this.isLoading = true;
        // TODO: Call backend API to resend verification code
        setTimeout(() => {
            this.isLoading = false;
        }, 1500);
    }
} 