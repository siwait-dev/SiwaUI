import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { AppSettingsFacade } from '../../../core/store/app-settings/app-settings.facade';

@Component({
  selector: 'app-app-settings',
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
      <h1 class="text-2xl font-bold">{{ 'ADMIN.APP_SETTINGS.TITLE' | translate }}</h1>

      @if (loading()) {
        <p class="text-surface-500">{{ 'COMMON.LOADING' | translate }}</p>
      } @else {
        <p-card [header]="'ADMIN.APP_SETTINGS.GENERAL' | translate">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <label class="font-medium">{{ 'ADMIN.APP_SETTINGS.APP_NAME' | translate }}</label>
              <input pInputText [(ngModel)]="appName" class="w-full" />
            </div>
          </div>
        </p-card>

        <p-card [header]="'ADMIN.APP_SETTINGS.SECURITY' | translate">
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">{{ 'ADMIN.APP_SETTINGS.IDLE_TIMEOUT' | translate }}</p>
                <p class="text-surface-500 text-sm">
                  {{ 'ADMIN.APP_SETTINGS.IDLE_DESCRIPTION' | translate }}
                </p>
              </div>
              <p-toggleSwitch [(ngModel)]="idleEnabled" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-medium">{{
                'ADMIN.APP_SETTINGS.TIMEOUT_MINUTES' | translate
              }}</label>
              <p-inputNumber [(ngModel)]="idleMinutes" [min]="1" [max]="120" class="w-32" />
            </div>
          </div>
        </p-card>

        @if (saveSuccess()) {
          <p-message
            severity="success"
            [text]="'ADMIN.APP_SETTINGS.SAVE_SUCCESS' | translate"
            styleClass="w-full"
          />
        }
        @if (saveError()) {
          <p-message
            severity="error"
            [text]="'ADMIN.APP_SETTINGS.SAVE_ERROR' | translate"
            styleClass="w-full"
          />
        }

        <p-button
          [label]="'ADMIN.APP_SETTINGS.SAVE' | translate"
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
  private readonly appSettingsFacade = inject(AppSettingsFacade);

  protected readonly loading = this.appSettingsFacade.loading;
  protected readonly saving = this.appSettingsFacade.saving;
  protected readonly saveSuccess = signal(false);
  protected readonly saveError = signal(false);

  protected appName = 'SiwaUI';
  protected idleEnabled = true;
  protected idleMinutes = 30;

  constructor() {
    effect(() => {
      const config = this.appSettingsFacade.config();
      this.appName = config.appName;
      this.idleEnabled = config.idleTimeoutEnabled;
      this.idleMinutes = config.idleTimeoutMinutes;
    });

    effect(() => {
      const feedback = this.appSettingsFacade.feedback();
      if (!feedback) return;

      this.saveSuccess.set(feedback.kind === 'saved');
      this.saveError.set(feedback.kind === 'save-failed');
      this.appSettingsFacade.consumeFeedback();
    });
  }

  ngOnInit(): void {
    this.appSettingsFacade.enterPage();
  }

  protected save(): void {
    this.saveSuccess.set(false);
    this.saveError.set(false);

    this.appSettingsFacade.updateDraft({
      appName: this.appName,
      idleTimeoutEnabled: this.idleEnabled,
      idleTimeoutMinutes: this.idleMinutes,
    });
    this.appSettingsFacade.save();
  }
}
