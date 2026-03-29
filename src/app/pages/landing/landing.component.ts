import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, TranslateModule, ButtonModule, CardModule],
  template: `
    <p-card>
      <div class="flex flex-col items-center gap-6 py-8 text-center">
        <h1 class="text-4xl font-bold">{{ 'PUBLIC.LANDING.TITLE' | translate }}</h1>
        <p class="text-lg text-surface-500 max-w-md">
          {{ 'PUBLIC.LANDING.SUBTITLE' | translate }}
        </p>
        <div class="flex gap-3">
          <p-button
            [label]="'PUBLIC.LANDING.SIGN_IN' | translate"
            routerLink="/login"
            severity="primary"
          />
          <p-button
            [label]="'PUBLIC.LANDING.CREATE_ACCOUNT' | translate"
            routerLink="/register"
            [outlined]="true"
          />
        </div>
      </div>
    </p-card>
  `,
})
export class LandingComponent {}
