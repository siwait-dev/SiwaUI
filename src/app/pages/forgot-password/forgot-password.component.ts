import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    MessageModule,
  ],
  template: `
    <p-card [header]="'USER.FORGOT_PASSWORD.TITLE' | translate">
      @if (sent()) {
        <!-- Succesbericht -->
        <div class="flex flex-col gap-4">
          <p-message
            severity="success"
            [text]="'USER.FORGOT_PASSWORD.SUCCESS' | translate"
            styleClass="w-full"
          />
          <a routerLink="/login" class="text-sm text-surface-500 text-center">
            {{ 'USER.FORGOT_PASSWORD.BACK_TO_LOGIN' | translate }}
          </a>
        </div>
      } @else {
        <!-- Formulier -->
        <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="flex flex-col gap-4">
          <p class="text-surface-500">{{ 'USER.FORGOT_PASSWORD.INSTRUCTION' | translate }}</p>

          <!-- E-mailadres -->
          <div class="flex flex-col gap-1">
            <input
              pInputText
              type="email"
              formControlName="email"
              [placeholder]="'USER.FORGOT_PASSWORD.EMAIL_PLACEHOLDER' | translate"
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

          <!-- API-foutmelding -->
          @if (errorKey()) {
            <p-message severity="error" [text]="errorKey()! | translate" styleClass="w-full" />
          }

          <p-button
            type="submit"
            [label]="'USER.FORGOT_PASSWORD.SUBMIT' | translate"
            severity="primary"
            styleClass="w-full"
            [loading]="loading()"
          />

          <p class="text-center text-sm">
            <a routerLink="/login" class="text-surface-500">
              {{ 'USER.FORGOT_PASSWORD.BACK_TO_LOGIN' | translate }}
            </a>
          </p>
        </form>
      }
    </p-card>
  `,
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  protected readonly loading = signal(false);
  protected readonly errorKey = signal<string | null>(null);
  protected readonly sent = signal(false);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
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

    const { email } = this.form.getRawValue();

    this.authService.forgotPassword({ email: email! }).subscribe({
      next: () => {
        this.loading.set(false);
        this.sent.set(true);
      },
      error: () => {
        this.loading.set(false);
        this.errorKey.set('VALIDATION.SERVER_ERROR');
      },
    });
  }
}
