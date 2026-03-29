import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-dashboard',
  imports: [TranslateModule, CardModule, TagModule],
  template: `
    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">{{ 'DASHBOARD.TITLE' | translate }}</h1>
        <p-tag [value]="'DASHBOARD.LIVE' | translate" severity="success" icon="pi pi-circle-fill" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        @for (stat of stats; track stat.labelKey) {
          <p-card>
            <div class="flex items-center gap-4">
              <div
                class="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <i [class]="stat.icon + ' text-primary text-xl'"></i>
              </div>
              <div>
                <p class="text-surface-500 text-sm">{{ stat.labelKey | translate }}</p>
                <p class="text-2xl font-bold">{{ stat.value }}</p>
              </div>
            </div>
          </p-card>
        }
      </div>

      <p-card [header]="'DASHBOARD.RECENT_ACTIVITY' | translate">
        <p class="text-surface-500 italic">
          {{ 'DASHBOARD.SIGNALR_PLACEHOLDER' | translate }}
        </p>
      </p-card>
    </div>
  `,
})
export class DashboardComponent {
  readonly stats = [
    { labelKey: 'DASHBOARD.TOTAL_USERS', value: '–', icon: 'pi pi-users' },
    { labelKey: 'DASHBOARD.ACTIVE_SESSIONS', value: '–', icon: 'pi pi-desktop' },
    { labelKey: 'DASHBOARD.PENDING_TASKS', value: '–', icon: 'pi pi-list-check' },
  ];
}
