import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from '../../core/services/auth.service';

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
    <p-card [header]="'ACTIVATE.TITLE' | translate">
      <div class="flex flex-col items-center gap-6 py-4">
        <!-- Bezig met activeren -->
        @if (status() === 'loading') {
          <p-progressSpinner strokeWidth="4" styleClass="w-12 h-12" />
          <p class="text-surface-500">{{ 'ACTIVATE.ACTIVATING' | translate }}</p>
        }

        <!-- Succesvol geactiveerd -->
        @if (status() === 'success') {
          <i class="pi pi-check-circle text-green-500 text-6xl"></i>
          <p class="text-center text-surface-600">{{ 'ACTIVATE.SUCCESS' | translate }}</p>
          <p-button
            [label]="'ACTIVATE.GO_TO_LOGIN' | translate"
            severity="primary"
            routerLink="/login"
          />
        }

        <!-- Fout: ongeldige of verlopen link -->
        @if (status() === 'error') {
          <i class="pi pi-times-circle text-red-500 text-6xl"></i>
          <p-message
            severity="error"
            [text]="'VALIDATION.INVALID_CODE' | translate"
            styleClass="w-full"
          />
          <p-button
            [label]="'ACTIVATE.REQUEST_NEW_LINK' | translate"
            severity="secondary"
            routerLink="/forgot-password"
          />
        }

        <!-- Geen params in URL: toon instructie -->
        @if (status() === 'no-params') {
          <i class="pi pi-envelope text-primary text-6xl"></i>
          <p class="text-center text-surface-500">{{ 'ACTIVATE.CHECK_EMAIL' | translate }}</p>
          <a routerLink="/login" class="text-sm text-surface-500">
            {{ 'ACTIVATE.BACK_TO_LOGIN' | translate }}
          </a>
        }
      </div>
    </p-card>
  `,
})
export class ActivateComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly status = signal<'loading' | 'success' | 'error' | 'no-params'>('loading');

  ngOnInit(): void {
    const email = this.route.snapshot.queryParamMap.get('email');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!email || !token) {
      this.status.set('no-params');
      return;
    }

    this.authService.activate({ email, token }).subscribe({
      next: () => {
        this.status.set('success');
        // Na 3 seconden automatisch naar login
        setTimeout(() => void this.router.navigate(['/login']), 3000);
      },
      error: () => this.status.set('error'),
    });
  }
}
