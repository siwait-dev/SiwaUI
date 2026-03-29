import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

interface ProfileResponse {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    AvatarModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    MessageModule,
  ],
  template: `
    <div class="flex flex-col gap-6 max-w-2xl">
      <h1 class="text-2xl font-bold">{{ 'USER.PROFILE.TITLE' | translate }}</h1>

      @if (loading()) {
        <p class="text-surface-500">{{ 'COMMON.LOADING' | translate }}</p>
      } @else {
        <p-card>
          <div class="flex items-center gap-4 mb-6">
            <p-avatar
              [label]="initials()"
              size="xlarge"
              shape="circle"
              styleClass="bg-primary text-white font-bold"
            />
            <div>
              <h2 class="text-lg font-semibold">
                {{ form.value.firstName }} {{ form.value.lastName }}
              </h2>
              <p class="text-surface-500 text-sm">{{ email() }}</p>
              @if (roles().length > 0) {
                <p class="text-surface-400 text-xs mt-1">{{ roles().join(', ') }}</p>
              }
            </div>
          </div>

          <form [formGroup]="form" (ngSubmit)="save()" novalidate class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <label class="font-medium">{{ 'USER.PROFILE.FIRST_NAME' | translate }}</label>
              <input pInputText formControlName="firstName" class="w-full" />
              @if (isInvalid('firstName')) {
                <small class="text-red-500">{{ 'VALIDATION.REQUIRED' | translate }}</small>
              }
            </div>

            <div class="flex flex-col gap-1">
              <label class="font-medium">{{ 'USER.PROFILE.LAST_NAME' | translate }}</label>
              <input pInputText formControlName="lastName" class="w-full" />
              @if (isInvalid('lastName')) {
                <small class="text-red-500">{{ 'VALIDATION.REQUIRED' | translate }}</small>
              }
            </div>

            <div class="flex flex-col gap-1">
              <label class="font-medium">{{ 'USER.PROFILE.EMAIL_READONLY' | translate }}</label>
              <input pInputText [value]="email()" class="w-full opacity-60" readonly />
            </div>

            @if (saveSuccess()) {
              <p-message
                severity="success"
                [text]="'USER.PROFILE.SAVE_SUCCESS' | translate"
                styleClass="w-full"
              />
            }
            @if (saveError()) {
              <p-message
                severity="error"
                [text]="'USER.PROFILE.SAVE_ERROR' | translate"
                styleClass="w-full"
              />
            }

            <p-button
              type="submit"
              [label]="'USER.PROFILE.SAVE' | translate"
              icon="pi pi-save"
              severity="primary"
              [loading]="saving()"
            />
          </form>
        </p-card>
      }
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly saveSuccess = signal(false);
  protected readonly saveError = signal(false);
  protected readonly email = signal('');
  protected readonly roles = signal<string[]>([]);

  protected readonly initials = () => {
    const fn = this.form.value.firstName ?? '';
    const ln = this.form.value.lastName ?? '';
    return `${fn.charAt(0)}${ln.charAt(0)}`.toUpperCase() || '?';
  };

  readonly form = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
  });

  ngOnInit(): void {
    this.api.get<ProfileResponse>('auth/me').subscribe({
      next: profile => {
        this.form.patchValue({ firstName: profile.firstName, lastName: profile.lastName });
        this.email.set(profile.email);
        this.roles.set(profile.roles);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
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

    const { firstName, lastName } = this.form.value;
    this.api.put<void>('auth/me', { firstName, lastName }).subscribe({
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
