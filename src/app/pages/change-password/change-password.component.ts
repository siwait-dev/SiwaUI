import { Component, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ApiService } from '../../core/services/api.service';
import { PasswordPolicyService } from '../../core/services/password-policy.service';

function passwordMatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const pw = group.get('newPassword')?.value as string;
    const cpw = group.get('confirmPassword')?.value as string;
    return pw && cpw && pw !== cpw ? { passwordMismatch: true } : null;
  };
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    CardModule,
    MessageModule,
    PasswordModule,
  ],
  template: `
    <div class="flex justify-center">
      <div class="w-full max-w-md">
        <p-card [header]="'USER.CHANGE_PASSWORD.TITLE' | translate">
          <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="flex flex-col gap-4">
            <!-- Expired password warning -->
            @if (isExpired) {
              <p-message
                severity="warn"
                [text]="'USER.CHANGE_PASSWORD.EXPIRED_WARNING' | translate"
                styleClass="w-full"
              />
            }

            <!-- Current password -->
            <div class="flex flex-col gap-1">
              <label for="currentPassword" class="font-medium">
                {{ 'USER.CHANGE_PASSWORD.CURRENT_PASSWORD' | translate }}
              </label>
              <p-password
                inputId="currentPassword"
                formControlName="currentPassword"
                [feedback]="false"
                [toggleMask]="true"
                styleClass="w-full"
                [invalid]="isInvalid('currentPassword')"
                [placeholder]="'USER.CHANGE_PASSWORD.CURRENT_PASSWORD' | translate"
              />
              @if (isInvalid('currentPassword')) {
                <small class="text-red-500">{{ 'VALIDATION.REQUIRED' | translate }}</small>
              }
            </div>

            <!-- New password -->
            <div class="flex flex-col gap-1">
              <label for="newPassword" class="font-medium">
                {{ 'USER.CHANGE_PASSWORD.NEW_PASSWORD' | translate }}
              </label>
              <p-password
                inputId="newPassword"
                formControlName="newPassword"
                [feedback]="false"
                [toggleMask]="true"
                styleClass="w-full"
                [invalid]="isInvalid('newPassword')"
                [placeholder]="'USER.CHANGE_PASSWORD.NEW_PASSWORD' | translate"
              />
              @if (isInvalid('newPassword')) {
                <div class="flex flex-col gap-0.5">
                  @if (form.get('newPassword')?.hasError('required')) {
                    <small class="text-red-500">{{ 'VALIDATION.REQUIRED' | translate }}</small>
                  }
                  @for (errKey of policyErrors(); track errKey) {
                    <small class="text-red-500">
                      {{ errKey | translate: policyErrorParams(errKey) }}
                    </small>
                  }
                </div>
              }
            </div>

            <!-- Confirm password -->
            <div class="flex flex-col gap-1">
              <label for="confirmPassword" class="font-medium">
                {{ 'USER.CHANGE_PASSWORD.CONFIRM_PASSWORD' | translate }}
              </label>
              <p-password
                inputId="confirmPassword"
                formControlName="confirmPassword"
                [feedback]="false"
                [toggleMask]="true"
                styleClass="w-full"
                [invalid]="isInvalidConfirm()"
                [placeholder]="'USER.CHANGE_PASSWORD.CONFIRM_PASSWORD' | translate"
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

            <!-- Success message -->
            @if (successMessage()) {
              <p-message
                severity="success"
                [text]="'USER.CHANGE_PASSWORD.SUCCESS' | translate"
                styleClass="w-full"
              />
            }

            <!-- API error message -->
            @if (errorKey()) {
              <p-message severity="error" [text]="errorKey()! | translate" styleClass="w-full" />
            }

            <p-button
              type="submit"
              [label]="'USER.CHANGE_PASSWORD.SUBMIT' | translate"
              severity="primary"
              styleClass="w-full"
              [loading]="loading()"
            />
          </form>
        </p-card>
      </div>
    </div>
  `,
})
export class ChangePasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly policyService = inject(PasswordPolicyService);

  protected readonly loading = signal(false);
  protected readonly errorKey = signal<string | null>(null);
  protected readonly successMessage = signal(false);

  protected isExpired = false;

  readonly form = this.fb.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator() },
  );

  ngOnInit(): void {
    const reason = this.route.snapshot.queryParamMap.get('reason');
    this.isExpired = reason === 'expired';

    this.policyService.getPolicy().subscribe(() => {
      const ctrl = this.form.get('newPassword')!;
      ctrl.setValidators([Validators.required, this.policyService.passwordValidator()]);
      ctrl.updateValueAndValidity();
    });
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

  policyErrors(): string[] {
    const errors = this.form.get('newPassword')?.errors?.['passwordPolicy'] as string[] | undefined;
    if (!errors) return [];
    // Strip parameter suffix (e.g. "VALIDATION.PASSWORD_MIN_LENGTH:8" â†’ key only)
    return errors.map(e => e.split(':')[0]);
  }

  policyErrorParams(errKey: string): Record<string, unknown> {
    const errors = this.form.get('newPassword')?.errors?.['passwordPolicy'] as string[] | undefined;
    if (!errors) return {};
    const raw = errors.find(e => e.startsWith(errKey + ':'));
    if (!raw) return {};
    const count = raw.split(':')[1];
    return { count };
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorKey.set(null);
    this.successMessage.set(false);

    const { currentPassword, newPassword } = this.form.getRawValue();

    this.api.post<void>('auth/change-password', { currentPassword, newPassword }).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set(true);

        setTimeout(() => {
          void this.router.navigate(['/app/dashboard']);
        }, 1500);
      },
      error: (err: { status?: number }) => {
        this.loading.set(false);
        if (err?.status === 400) {
          this.errorKey.set('VALIDATION.INVALID_CREDENTIALS');
        } else {
          this.errorKey.set('VALIDATION.SERVER_ERROR');
        }
      },
    });
  }
}
