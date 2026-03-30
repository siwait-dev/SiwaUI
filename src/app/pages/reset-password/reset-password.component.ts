import { Component, effect, inject, OnInit, signal } from '@angular/core';
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
import { PasswordPolicyService } from '../../core/services/password-policy.service';
import { ResetPasswordFacade } from '../../core/store/reset-password/reset-password.facade';

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
    <p-card [header]="'USER.RESET_PASSWORD.TITLE' | translate">
      <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="flex flex-col gap-4">
        <p class="text-surface-500">{{ 'USER.RESET_PASSWORD.INSTRUCTION' | translate }}</p>

        <div class="flex flex-col gap-1">
          <label for="newPassword" class="font-medium">
            {{ 'USER.RESET_PASSWORD.NEW_PASSWORD' | translate }}
          </label>
          <p-password
            inputId="newPassword"
            formControlName="newPassword"
            [feedback]="false"
            [toggleMask]="true"
            styleClass="w-full"
            [invalid]="isInvalid('newPassword')"
            [placeholder]="'USER.RESET_PASSWORD.NEW_PASSWORD' | translate"
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

        <div class="flex flex-col gap-1">
          <label for="confirmPassword" class="font-medium">
            {{ 'USER.RESET_PASSWORD.CONFIRM_PASSWORD' | translate }}
          </label>
          <p-password
            inputId="confirmPassword"
            formControlName="confirmPassword"
            [feedback]="false"
            [toggleMask]="true"
            styleClass="w-full"
            [invalid]="isInvalidConfirm()"
            [placeholder]="'USER.RESET_PASSWORD.CONFIRM_PASSWORD' | translate"
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

        @if (errorKey()) {
          <p-message severity="error" [text]="errorKey()! | translate" styleClass="w-full" />
        }

        <p-button
          type="submit"
          [label]="'USER.RESET_PASSWORD.SUBMIT' | translate"
          severity="primary"
          styleClass="w-full"
          [loading]="loading()"
        />

        <a routerLink="/login" class="text-center text-sm text-surface-500">
          {{ 'USER.RESET_PASSWORD.BACK_TO_LOGIN' | translate }}
        </a>
      </form>
    </p-card>
  `,
})
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly policyService = inject(PasswordPolicyService);
  private readonly resetPasswordFacade = inject(ResetPasswordFacade);

  protected readonly loading = this.resetPasswordFacade.loading;
  protected readonly errorKey = signal<string | null>(null);

  readonly form = this.fb.group(
    {
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator },
  );

  constructor() {
    effect(() => {
      if (!this.resetPasswordFacade.policyReady()) return;

      const ctrl = this.form.get('newPassword')!;
      ctrl.setValidators([Validators.required, this.policyService.passwordValidator()]);
      ctrl.updateValueAndValidity();
    });

    effect(() => {
      const feedback = this.resetPasswordFacade.feedback();
      if (!feedback) return;

      this.errorKey.set(feedback.errorKey);
      this.resetPasswordFacade.consumeFeedback();
    });
  }

  ngOnInit(): void {
    const email = this.route.snapshot.queryParamMap.get('email') ?? '';
    const token = this.route.snapshot.queryParamMap.get('token') ?? '';

    if (!email || !token) {
      void this.router.navigate(['/forgot-password']);
      return;
    }

    this.resetPasswordFacade.setRequestContext(email, token);
    this.resetPasswordFacade.enterPage();
  }

  translatePolicyError(err: string): string {
    const sep = err.indexOf(':');
    return sep > 0 ? err.substring(0, sep) : err;
  }

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

    this.errorKey.set(null);

    const { newPassword } = this.form.getRawValue();
    this.resetPasswordFacade.submit(
      this.resetPasswordFacade.email(),
      this.resetPasswordFacade.token(),
      newPassword ?? '',
    );
  }
}
