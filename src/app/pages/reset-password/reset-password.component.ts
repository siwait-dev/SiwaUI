import { Component, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../core/services/auth.service';
import { PasswordPolicyService } from '../../core/services/password-policy.service';

/** Valideert dat 'confirmPassword' gelijk is aan 'newPassword'. */
const passwordMatchValidator: ValidatorFn = (group: AbstractControl) => {
  const pw = group.get('newPassword')?.value;
  const cpw = group.get('confirmPassword')?.value;
  return pw && cpw && pw !== cpw ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'app-reset-password',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    CardModule,
    MessageModule,
    PasswordModule,
  ],
  template: `
    <p-card [header]="'RESET_PASSWORD.TITLE' | translate">
      <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="flex flex-col gap-4">
        <p class="text-surface-500">{{ 'RESET_PASSWORD.INSTRUCTION' | translate }}</p>

        <!-- Nieuw wachtwoord -->
        <div class="flex flex-col gap-1">
          <label for="newPassword" class="font-medium">
            {{ 'RESET_PASSWORD.NEW_PASSWORD' | translate }}
          </label>
          <p-password
            inputId="newPassword"
            formControlName="newPassword"
            [feedback]="false"
            [toggleMask]="true"
            styleClass="w-full"
            [invalid]="isInvalid('newPassword')"
            [placeholder]="'RESET_PASSWORD.NEW_PASSWORD' | translate"
          />
          @if (isInvalid('newPassword')) {
            @if (form.get('newPassword')?.hasError('required')) {
              <small class="text-red-500">{{ 'VALIDATION.REQUIRED' | translate }}</small>
            }
            @for (err of form.get('newPassword')?.errors?.['passwordPolicy'] ?? []; track err) {
              <small class="text-red-500">{{
                translatePolicyError(err) | translate: getPolicyErrorParams(err)
              }}</small>
            }
          }
        </div>

        <!-- Bevestig wachtwoord -->
        <div class="flex flex-col gap-1">
          <label for="confirmPassword" class="font-medium">
            {{ 'RESET_PASSWORD.CONFIRM_PASSWORD' | translate }}
          </label>
          <p-password
            inputId="confirmPassword"
            formControlName="confirmPassword"
            [feedback]="false"
            [toggleMask]="true"
            styleClass="w-full"
            [invalid]="isInvalidConfirm()"
            [placeholder]="'RESET_PASSWORD.CONFIRM_PASSWORD' | translate"
          />
          @if (isInvalidConfirm()) {
            <small class="text-red-500">
              @if (form.get('confirmPassword')?.hasError('required')) {
                {{ 'VALIDATION.REQUIRED' | translate }}
              } @else {
                {{ 'VALIDATION.PASSWORD_MISMATCH' | translate }}
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
          [label]="'RESET_PASSWORD.SUBMIT' | translate"
          severity="primary"
          styleClass="w-full"
          [loading]="loading()"
        />

        <a routerLink="/login" class="text-center text-sm text-surface-500">
          {{ 'RESET_PASSWORD.BACK_TO_LOGIN' | translate }}
        </a>
      </form>
    </p-card>
  `,
})
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly policyService = inject(PasswordPolicyService);

  protected readonly loading = signal(false);
  protected readonly errorKey = signal<string | null>(null);

  private email = '';
  private token = '';

  readonly form = this.fb.group(
    {
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator },
  );

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';

    if (!this.email || !this.token) {
      void this.router.navigate(['/forgot-password']);
      return;
    }

    // Laad beleid en stel dynamische validator in
    this.policyService.getPolicy().subscribe(() => {
      const ctrl = this.form.get('newPassword')!;
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

  isInvalidConfirm(): boolean {
    const ctrl = this.form.get('confirmPassword');
    if (!ctrl || !ctrl.touched) return false;
    return ctrl.invalid || !!this.form.hasError('passwordMismatch');
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorKey.set(null);

    const { newPassword } = this.form.getRawValue();

    this.authService
      .resetPassword({ email: this.email, token: this.token, newPassword: newPassword! })
      .subscribe({
        next: () => {
          this.loading.set(false);
          void this.router.navigate(['/login'], {
            queryParams: { reset: 'success' },
          });
        },
        error: (err: { status?: number }) => {
          this.loading.set(false);
          this.errorKey.set(
            err?.status === 400 || err?.status === 404
              ? 'VALIDATION.INVALID_RESET_TOKEN'
              : 'VALIDATION.SERVER_ERROR',
          );
        },
      });
  }
}
