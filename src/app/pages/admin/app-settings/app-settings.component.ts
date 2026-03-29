import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';

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
  ],
  template: `
    <div class="flex flex-col gap-6 max-w-lg">
      <h1 class="text-2xl font-bold">{{ 'APP_SETTINGS.TITLE' | translate }}</h1>

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

      <p-button [label]="'APP_SETTINGS.SAVE' | translate" icon="pi pi-save" severity="primary" />
    </div>
  `,
})
export class AppSettingsComponent {
  appName = 'SiwaUI';
  idleEnabled = true;
  idleMinutes = 30;
}
