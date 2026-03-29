import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { ApiService } from '../../../core/services/api.service';
import { PasswordPolicy } from '../../../core/services/password-policy.service';

@Component({
  selector: 'app-password-policy',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    InputNumberModule,
    MessageModule,
  ],
  template: `
    <div class="flex flex-col gap-6 max-w-lg">
      <h1 class="text-2xl font-bold">{{ 'ADMIN.PASSWORD_POLICY.TITLE' | translate }}</h1>

      @if (loading()) {
        <p class="text-surface-500">{{ 'COMMON.LOADING' | translate }}</p>
      } @else {
        <form [formGroup]="form" (ngSubmit)="save()" novalidate class="flex flex-col gap-6">
          <!-- Complexity -->
          <p-card [header]="'ADMIN.PASSWORD_POLICY.COMPLEXITY' | translate">
            <div class="flex flex-col gap-4">
              <!-- Min length -->
              <div class="flex flex-col gap-1">
                <label class="font-medium">{{
                  'ADMIN.PASSWORD_POLICY.MIN_LENGTH' | translate
                }}</label>
                <p class="text-surface-500 text-sm">
                  {{ 'ADMIN.PASSWORD_POLICY.MIN_LENGTH_HINT' | translate }}
                </p>
                <p-inputNumber
                  formControlName="minLength"
                  [min]="1"
                  [max]="128"
                  [showButtons]="true"
                  styleClass="w-32"
                />
                @if (isInvalid('minLength')) {
                  <small class="text-red-500">{{ 'VALIDATION.REQUIRED' | translate }}</small>
                }
              </div>

              <!-- Require digit -->
              <div class="flex items-center gap-3">
                <p-checkbox formControlName="requireDigit" [binary]="true" inputId="requireDigit" />
                <div>
                  <label for="requireDigit" class="font-medium cursor-pointer">
                    {{ 'ADMIN.PASSWORD_POLICY.REQUIRE_DIGIT' | translate }}
                  </label>
                  <p class="text-surface-500 text-sm">
                    {{ 'ADMIN.PASSWORD_POLICY.REQUIRE_DIGIT_HINT' | translate }}
                  </p>
                </div>
              </div>

              <!-- Require uppercase -->
              <div class="flex items-center gap-3">
                <p-checkbox
                  formControlName="requireUppercase"
                  [binary]="true"
                  inputId="requireUppercase"
                />
                <div>
                  <label for="requireUppercase" class="font-medium cursor-pointer">
                    {{ 'ADMIN.PASSWORD_POLICY.REQUIRE_UPPERCASE' | translate }}
                  </label>
                  <p class="text-surface-500 text-sm">
                    {{ 'ADMIN.PASSWORD_POLICY.REQUIRE_UPPERCASE_HINT' | translate }}
                  </p>
                </div>
              </div>

              <!-- Require special character -->
              <div class="flex items-center gap-3">
                <p-checkbox
                  formControlName="requireNonAlphanumeric"
                  [binary]="true"
                  inputId="requireNonAlphanumeric"
                />
                <div>
                  <label for="requireNonAlphanumeric" class="font-medium cursor-pointer">
                    {{ 'ADMIN.PASSWORD_POLICY.REQUIRE_SPECIAL' | translate }}
                  </label>
                  <p class="text-surface-500 text-sm">
                    {{ 'ADMIN.PASSWORD_POLICY.REQUIRE_SPECIAL_HINT' | translate }}
                  </p>
                </div>
              </div>
            </div>
          </p-card>

          <!-- Expiry -->
          <p-card [header]="'ADMIN.PASSWORD_POLICY.EXPIRY' | translate">
            <div class="flex flex-col gap-4">
              <!-- Max age days -->
              <div class="flex flex-col gap-1">
                <label class="font-medium">{{
                  'ADMIN.PASSWORD_POLICY.MAX_AGE_DAYS' | translate
                }}</label>
                <p class="text-surface-500 text-sm">
                  {{ 'ADMIN.PASSWORD_POLICY.MAX_AGE_HINT' | translate }}
                </p>
                <p-inputNumber
                  formControlName="maxAgeDays"
                  [min]="0"
                  [showButtons]="true"
                  styleClass="w-32"
                />
              </div>

              <!-- Refresh token expiration days -->
              <div class="flex flex-col gap-1">
                <label class="font-medium">{{
                  'ADMIN.PASSWORD_POLICY.REFRESH_TOKEN_DAYS' | translate
                }}</label>
                <p-inputNumber
                  formControlName="refreshTokenExpirationDays"
                  [min]="1"
                  [showButtons]="true"
                  styleClass="w-32"
                />
                @if (isInvalid('refreshTokenExpirationDays')) {
                  <small class="text-red-500">{{ 'VALIDATION.REQUIRED' | translate }}</small>
                }
              </div>
            </div>
          </p-card>

          <!-- History -->
          <p-card [header]="'ADMIN.PASSWORD_POLICY.HISTORY' | translate">
            <div class="flex flex-col gap-1">
              <label class="font-medium">{{
                'ADMIN.PASSWORD_POLICY.HISTORY_COUNT' | translate
              }}</label>
              <p class="text-surface-500 text-sm">
                {{ 'ADMIN.PASSWORD_POLICY.HISTORY_HINT' | translate }}
              </p>
              <p-inputNumber
                formControlName="historyCount"
                [min]="0"
                [showButtons]="true"
                styleClass="w-32"
              />
            </div>
          </p-card>

          <!-- Breached passwords -->
          <p-card [header]="'ADMIN.PASSWORD_POLICY.BREACHED' | translate">
            <div class="flex items-center gap-3">
              <p-checkbox
                formControlName="checkBreachedPasswords"
                [binary]="true"
                inputId="checkBreachedPasswords"
              />
              <label for="checkBreachedPasswords" class="font-medium cursor-pointer">
                {{ 'ADMIN.PASSWORD_POLICY.CHECK_BREACHED' | translate }}
              </label>
            </div>
          </p-card>

          <!-- Success / error messages -->
          @if (saveSuccess()) {
            <p-message
              severity="success"
              [text]="'ADMIN.PASSWORD_POLICY.SAVE_SUCCESS' | translate"
              styleClass="w-full"
            />
          }
          @if (saveError()) {
            <p-message
              severity="error"
              [text]="'ADMIN.PASSWORD_POLICY.SAVE_ERROR' | translate"
              styleClass="w-full"
            />
          }

          <p-button
            type="submit"
            [label]="'ADMIN.PASSWORD_POLICY.SAVE' | translate"
            icon="pi pi-save"
            severity="primary"
            [loading]="saving()"
          />
        </form>
      }
    </div>
  `,
})
export class PasswordPolicyComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);

  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly saveSuccess = signal(false);
  protected readonly saveError = signal(false);

  readonly form = this.fb.group({
    minLength: [8, [Validators.required, Validators.min(1), Validators.max(128)]],
    requireDigit: [false],
    requireUppercase: [false],
    requireNonAlphanumeric: [false],
    maxAgeDays: [0],
    historyCount: [0],
    checkBreachedPasswords: [false],
    refreshTokenExpirationDays: [7, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.api.get<PasswordPolicy>('password-policy').subscribe({
      next: policy => {
        // Toon het formulier eerst zodat alle PrimeNG-componenten in de DOM zijn,
        // dan pas patchValue aanroepen zodat writeValue() correct wordt verwerkt.
        this.loading.set(false);
        this.form.patchValue(policy);
      },
      error: () => {
        this.loading.set(false);
        this.saveError.set(true);
      },
    });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!ctrl && ctrl.invalid && ctrl.touched;
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.saving.set(true);
    this.saveSuccess.set(false);
    this.saveError.set(false);

    const payload = this.form.getRawValue() as PasswordPolicy;

    this.api.put<void>('password-policy', payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.saveSuccess.set(true);
      },
      error: () => {
        this.saving.set(false);
        this.saveError.set(true);
      },
    });
  }
}
