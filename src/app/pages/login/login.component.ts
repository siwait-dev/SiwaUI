import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    MessageModule,
    PasswordModule,
  ],
  template: `
    <p-card [header]="'LOGIN.TITLE' | translate">
      <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="flex flex-col gap-4">
        <!-- E-mailadres -->
        <div class="flex flex-col gap-1">
          <label for="email" class="font-medium">{{ 'COMMON.EMAIL' | translate }}</label>
          <input
            id="email"
            pInputText
            type="email"
            formControlName="email"
            [placeholder]="'LOGIN.EMAIL_PLACEHOLDER' | translate"
            [invalid]="isInvalid('email')"
            class="w-full"
          />
          @if (isInvalid('email')) {
            <small class="text-red-500">
              @if (form.get('email')?.hasError('required')) {
                {{ 'VALIDATION.REQUIRED' | translate }}
              } @else {
                {{ 'VALIDATION.EMAIL_INVALID' | translate }}
              }
            </small>
          }
        </div>

        <!-- Wachtwoord -->
        <div class="flex flex-col gap-1">
          <label for="password" class="font-medium">{{ 'LOGIN.PASSWORD_LABEL' | translate }}</label>
          <p-password
            inputId="password"
            formControlName="password"
            [feedback]="false"
            [toggleMask]="true"
            styleClass="w-full"
            [invalid]="isInvalid('password')"
            [placeholder]="'LOGIN.PASSWORD_LABEL' | translate"
          />
          @if (isInvalid('password')) {
            <small class="text-red-500">
              @if (form.get('password')?.hasError('required')) {
                {{ 'VALIDATION.REQUIRED' | translate }}
              } @else {
                {{ 'VALIDATION.PASSWORD_MIN' | translate }}
              }
            </small>
          }
        </div>

        <!-- Succesbericht na wachtwoord-reset -->
        @if (resetSuccess()) {
          <p-message
            severity="success"
            [text]="'LOGIN.PASSWORD_RESET_SUCCESS' | translate"
            styleClass="w-full"
          />
        }

        <!-- API-foutmelding -->
        @if (errorKey()) {
          <p-message severity="error" [text]="errorKey()! | translate" styleClass="w-full" />
        }

        <p-button
          type="submit"
          [label]="'LOGIN.SUBMIT' | translate"
          severity="primary"
          styleClass="w-full"
          [loading]="loading()"
        />

        <p class="text-center text-sm">
          {{ 'LOGIN.NO_ACCOUNT' | translate }}
          <a routerLink="/register" class="text-primary font-medium">
            {{ 'LOGIN.CREATE_ONE' | translate }}
          </a>
        </p>
        <p class="text-center text-sm">
          <a routerLink="/forgot-password" class="text-surface-500">
            {{ 'LOGIN.FORGOT_PASSWORD' | translate }}
          </a>
        </p>
      </form>
    </p-card>
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly loading = signal(false);
  protected readonly errorKey = signal<string | null>(null);
  protected readonly resetSuccess = signal(
    this.route.snapshot.queryParamMap.get('reset') === 'success',
  );

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!ctrl && ctrl.invalid && ctrl.touched;
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorKey.set(null);

    const { email, password } = this.form.getRawValue();

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: res => {
        this.loading.set(false);
        if (res.mustChangePassword) {
          void this.router.navigate(['/app/change-password'], {
            queryParams: { reason: 'expired' },
          });
        } else {
          void this.router.navigate(['/app/dashboard']);
        }
      },
      error: (err: { status?: number }) => {
        this.loading.set(false);
        this.errorKey.set(
          err?.status === 401 ? 'VALIDATION.INVALID_CREDENTIALS' : 'VALIDATION.SERVER_ERROR',
        );
      },
    });
  }
}
