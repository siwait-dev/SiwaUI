import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { LoginFacade } from '../../core/store/login/login.facade';

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
    <p-card [header]="'USER.LOGIN.TITLE' | translate">
      <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label for="email" class="font-medium">{{ 'COMMON.EMAIL' | translate }}</label>
          <input
            id="email"
            pInputText
            type="email"
            formControlName="email"
            [placeholder]="'USER.LOGIN.EMAIL_PLACEHOLDER' | translate"
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

        <div class="flex flex-col gap-1">
          <label for="password" class="font-medium">{{
            'USER.LOGIN.PASSWORD_LABEL' | translate
          }}</label>
          <p-password
            inputId="password"
            formControlName="password"
            [feedback]="false"
            [toggleMask]="true"
            styleClass="w-full"
            [invalid]="isInvalid('password')"
            [placeholder]="'USER.LOGIN.PASSWORD_LABEL' | translate"
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

        @if (resetSuccess()) {
          <p-message
            severity="success"
            [text]="'USER.LOGIN.PASSWORD_RESET_SUCCESS' | translate"
            styleClass="w-full"
          />
        }

        @if (errorKey()) {
          <p-message severity="error" [text]="errorKey()! | translate" styleClass="w-full" />
        }

        <p-button
          type="submit"
          [label]="'USER.LOGIN.SUBMIT' | translate"
          severity="primary"
          styleClass="w-full"
          [loading]="loading()"
        />

        <p class="text-center text-sm">
          {{ 'USER.LOGIN.NO_ACCOUNT' | translate }}
          <a routerLink="/register" class="text-primary font-medium">
            {{ 'USER.LOGIN.CREATE_ONE' | translate }}
          </a>
        </p>
        <p class="text-center text-sm">
          <a routerLink="/forgot-password" class="text-surface-500">
            {{ 'USER.LOGIN.FORGOT_PASSWORD' | translate }}
          </a>
        </p>
      </form>
    </p-card>
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly loginFacade = inject(LoginFacade);

  protected readonly loading = this.loginFacade.loading;
  protected readonly errorKey = signal<string | null>(null);
  protected readonly resetSuccess = signal(
    this.route.snapshot.queryParamMap.get('reset') === 'success',
  );

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor() {
    effect(() => {
      const feedback = this.loginFacade.feedback();
      if (!feedback) return;

      this.errorKey.set(feedback.errorKey);
      this.loginFacade.consumeFeedback();
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

    const { email, password } = this.form.getRawValue();
    this.loginFacade.submit(email!, password!);
  }
}
