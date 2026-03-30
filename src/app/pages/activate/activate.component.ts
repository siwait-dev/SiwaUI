import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ActivateFacade } from '../../core/store/activate/activate.facade';

@Component({
  selector: 'app-activate',
  imports: [
    RouterLink,
    TranslateModule,
    ButtonModule,
    CardModule,
    MessageModule,
    ProgressSpinnerModule,
  ],
  template: `
    <p-card [header]="'USER.ACTIVATE.TITLE' | translate">
      <div class="flex flex-col items-center gap-6 py-4">
        @if (status() === 'loading') {
          <p-progressSpinner strokeWidth="4" styleClass="w-12 h-12" />
          <p class="text-surface-500">{{ 'USER.ACTIVATE.ACTIVATING' | translate }}</p>
        }

        @if (status() === 'success') {
          <i class="pi pi-check-circle text-green-500 text-6xl"></i>
          <p class="text-center text-surface-600">{{ 'USER.ACTIVATE.SUCCESS' | translate }}</p>
          <p-button
            [label]="'USER.ACTIVATE.GO_TO_LOGIN' | translate"
            severity="primary"
            routerLink="/login"
          />
        }

        @if (status() === 'error') {
          <i class="pi pi-times-circle text-red-500 text-6xl"></i>
          <p-message
            severity="error"
            [text]="'VALIDATION.INVALID_CODE' | translate"
            styleClass="w-full"
          />
          <p-button
            [label]="'USER.ACTIVATE.REQUEST_NEW_LINK' | translate"
            severity="secondary"
            routerLink="/forgot-password"
          />
        }

        @if (status() === 'no-params') {
          <i class="pi pi-envelope text-primary text-6xl"></i>
          <p class="text-center text-surface-500">{{ 'USER.ACTIVATE.CHECK_EMAIL' | translate }}</p>
          <a routerLink="/login" class="text-sm text-surface-500">
            {{ 'USER.ACTIVATE.BACK_TO_LOGIN' | translate }}
          </a>
        }
      </div>
    </p-card>
  `,
})
export class ActivateComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly activateFacade = inject(ActivateFacade);

  protected readonly status = this.activateFacade.status;

  ngOnInit(): void {
    const email = this.route.snapshot.queryParamMap.get('email');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!email || !token) {
      this.activateFacade.setNoParams();
      return;
    }

    this.activateFacade.submit(email, token);
  }
}
