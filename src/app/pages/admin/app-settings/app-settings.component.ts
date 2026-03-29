import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ApiService } from '../../../core/services/api.service';

interface AppConfigDto {
  appName: string;
  idleTimeoutEnabled: boolean;
  idleTimeoutMinutes: number;
}

@Component({
  selector: 'app-app-settings',
  standalone: true,
  imports: [
    TranslateModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    ToggleSwitchModule,
    FormsModule,
    MessageModule,
  ],
  template: `
    <div class="flex flex-col gap-6 max-w-lg">
      <h1 class="text-2xl font-bold">{{ 'APP_SETTINGS.TITLE' | translate }}</h1>

      @if (loading()) {
        <p class="text-surface-500">{{ 'COMMON.LOADING' | translate }}</p>
      } @else {
        <p-card [header]="'APP_SETTINGS.GENERAL' | translate">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <label class="font-medium">{{ 'APP_SETTINGS.APP_NAME' | translate }}</label>
              <input pInputText [(ngModel)]="appName" class="w-full" />
            </div>
          </div>
        </p-card>

        <p-card [header]="'APP_SETTINGS.SECURITY' | translate">
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">{{ 'APP_SETTINGS.IDLE_TIMEOUT' | translate }}</p>
                <p class="text-surface-500 text-sm">
                  {{ 'APP_SETTINGS.IDLE_DESCRIPTION' | translate }}
                </p>
              </div>
              <p-toggleSwitch [(ngModel)]="idleEnabled" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-medium">{{ 'APP_SETTINGS.TIMEOUT_MINUTES' | translate }}</label>
              <p-inputNumber [(ngModel)]="idleMinutes" [min]="1" [max]="120" class="w-32" />
            </div>
          </div>
        </p-card>

        @if (saveSuccess()) {
          <p-message
            severity="success"
            [text]="'APP_SETTINGS.SAVE_SUCCESS' | translate"
            styleClass="w-full"
          />
        }
        @if (saveError()) {
          <p-message
            severity="error"
            [text]="'APP_SETTINGS.SAVE_ERROR' | translate"
            styleClass="w-full"
          />
        }

        <p-button
          [label]="'APP_SETTINGS.SAVE' | translate"
          icon="pi pi-save"
          severity="primary"
          [loading]="saving()"
          (onClick)="save()"
        />
      }
    </div>
  `,
})
export class AppSettingsComponent implements OnInit {
  private readonly api = inject(ApiService);

  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly saveSuccess = signal(false);
  protected readonly saveError = signal(false);

  protected appName = 'SiwaUI';
  protected idleEnabled = true;
  protected idleMinutes = 30;

  ngOnInit(): void {
    this.api.get<AppConfigDto>('settings').subscribe({
      next: config => {
        this.appName = config.appName;
        this.idleEnabled = config.idleTimeoutEnabled;
        this.idleMinutes = config.idleTimeoutMinutes;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected save(): void {
    this.saving.set(true);
    this.saveSuccess.set(false);
    this.saveError.set(false);

    this.api
      .put<AppConfigDto>('settings', {
        appName: this.appName,
        idleTimeoutEnabled: this.idleEnabled,
        idleTimeoutMinutes: this.idleMinutes,
      })
      .subscribe({
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
