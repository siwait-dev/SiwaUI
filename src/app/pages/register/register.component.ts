import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../core/services/auth.service';
import { PasswordPolicyService } from '../../core/services/password-policy.service';

@Component({
  selector: 'app-register',
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
    <p-card [header]="'REGISTER.TITLE' | translate">
      <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="flex flex-col gap-4">
        <!-- Voornaam -->
        <div class="flex flex-col gap-1">
          <label for="firstName" class="font-medium">{{ 'REGISTER.FIRST_NAME' | translate }}</label>
          <input
            id="firstName"
            pInputText
            formControlName="firstName"
            [placeholder]="'REGISTER.FIRST_NAME_PLACEHOLDER' | translate"
            [invalid]="isInvalid('firstName')"
            class="w-full"
          />
          @if (isInvalid('firstName')) {
            <small class="text-red-500">{{ 'VALIDATION.REQUIRED' | translate }}</small>
          }
        </div>

        <!-- Achternaam -->
        <div class="flex flex-col gap-1">
          <label for="lastName" class="font-medium">{{ 'REGISTER.LAST_NAME' | translate }}</label>
          <input
            id="lastName"
            pInputText
            formControlName="lastName"
            [placeholder]="'REGISTER.LAST_NAME_PLACEHOLDER' | translate"
            [invalid]="isInvalid('lastName')"
            class="w-full"
          />
          @if (isInvalid('lastName')) {
            <small class="text-red-500">{{ 'VALIDATION.REQUIRED' | translate }}</small>
          }
        </div>

        <!-- E-mailadres -->
        <div class="flex flex-col gap-1">
          <label for="email" class="font-medium">{{ 'COMMON.EMAIL' | translate }}</label>
          <input
            id="email"
            pInputText
            type="email"
            formControlName="email"
            [placeholder]="'REGISTER.EMAIL_PLACEHOLDER' | translate"
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
          <label for="password" class="font-medium">{{
            'REGISTER.PASSWORD_LABEL' | translate
          }}</label>
          <p-password
            inputId="password"
            formControlName="password"
            [feedback]="false"
            [toggleMask]="true"
            styleClass="w-full"
            [invalid]="isInvalid('password')"
            [placeholder]="'REGISTER.PASSWORD_LABEL' | translate"
          />
          @if (isInvalid('password')) {
            @if (form.get('password')?.hasError('required')) {
              <small class="text-red-500">{{ 'VALIDATION.REQUIRED' | translate }}</small>
            }
            @for (err of form.get('password')?.errors?.['passwordPolicy'] ?? []; track err) {
              <small class="text-red-500">{{
                translatePolicyError(err) | translate: getPolicyErrorParams(err)
              }}</small>
            }
            @if (
              !form.get('password')?.hasError('required') &&
              !form.get('password')?.hasError('passwordPolicy')
            ) {
              <small class="text-red-500">{{ 'VALIDATION.PASSWORD_MIN' | translate }}</small>
            }
          }
        </div>

        <!-- API-foutmelding -->
        @if (errorKey()) {
          <p-message severity="error" [text]="errorKey()! | translate" styleClass="w-full" />
        }

        <p-button
          type="submit"
          [label]="'REGISTER.SUBMIT' | translate"
          severity="primary"
          styleClass="w-full"
          [loading]="loading()"
        />

        <p class="text-center text-sm">
          {{ 'REGISTER.ALREADY_ACCOUNT' | translate }}
          <a routerLink="/login" class="text-primary font-medium">
            {{ 'REGISTER.SIGN_IN' | translate }}
          </a>
        </p>
      </form>
    </p-card>
  `,
})
export class RegisterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly policyService = inject(PasswordPolicyService);

  protected readonly loading = signal(false);
  protected readonly errorKey = signal<string | null>(null);

  readonly form = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.policyService.getPolicy().subscribe(() => {
      const ctrl = this.form.get('password')!;
      ctrl.setValidators([Validators.required, this.policyService.passwordValidator()]);
      ctrl.updateValueAndValidity();
    });
  }

  /** Extracts the translation key from a policy error string like 'VALIDATION.KEY:8' */
  translatePolicyError(err: string): string {
    const sep = err.indexOf(':');
    return sep > 0 ? err.substring(0, sep) : err;
  }

  /** Extracts params like { count: 8 } from a policy error string like 'VALIDATION.KEY:8' */
  getPolicyErrorParams(err: string): Record<string, unknown> {
    const sep = err.indexOf(':');
    return sep > 0 ? { count: err.substring(sep + 1) } : {};
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!ctrl && ctrl.invalid && ctrl.touched;
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorKey.set(null);

    const { firstName, lastName, email, password } = this.form.getRawValue();

    this.authService
      .register({ firstName: firstName!, lastName: lastName!, email: email!, password: password! })
      .subscribe({
        next: () => {
          this.loading.set(false);
          void this.router.navigate(['/activate'], { queryParams: { email } });
        },
        error: (err: { status?: number }) => {
          this.loading.set(false);
          this.errorKey.set(
            err?.status === 409 ? 'VALIDATION.ACCOUNT_EXISTS' : 'VALIDATION.SERVER_ERROR',
          );
        },
      });
  }
}
