import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ForgotPasswordFacade } from '../../core/store/forgot-password/forgot-password.facade';

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
        <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="flex flex-col gap-4">
          <p class="text-surface-500">{{ 'USER.FORGOT_PASSWORD.INSTRUCTION' | translate }}</p>

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
  private readonly forgotPasswordFacade = inject(ForgotPasswordFacade);

  protected readonly loading = this.forgotPasswordFacade.loading;
  protected readonly errorKey = signal<string | null>(null);
  protected readonly sent = signal(false);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor() {
    effect(() => {
      const feedback = this.forgotPasswordFacade.feedback();
      if (!feedback) return;

      this.sent.set(feedback.kind === 'success');
      this.errorKey.set(
        feedback.kind === 'error' ? (feedback.errorKey ?? 'VALIDATION.SERVER_ERROR') : null,
      );
      this.forgotPasswordFacade.consumeFeedback();
    });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!ctrl && ctrl.invalid && ctrl.touched;
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.errorKey.set(null);

    const { email } = this.form.getRawValue();
    this.forgotPasswordFacade.submit(email ?? '');
  }
}
