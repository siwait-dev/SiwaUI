import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-forbidden',
  imports: [RouterLink, TranslateModule, ButtonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-surface-ground">
      <div class="text-center flex flex-col items-center gap-4">
        <div class="text-8xl font-black text-warn opacity-20">
          {{ 'ERRORS.FORBIDDEN_CODE' | translate }}
        </div>
        <h1 class="text-2xl font-bold">{{ 'ERRORS.FORBIDDEN_TITLE' | translate }}</h1>
        <p class="text-surface-500 max-w-sm">{{ 'ERRORS.FORBIDDEN_TEXT' | translate }}</p>
        <p-button
          [label]="'ERRORS.GO_TO_DASHBOARD' | translate"
          routerLink="/app/dashboard"
          severity="primary"
        />
      </div>
    </div>
  `,
})
export class ForbiddenComponent {}
