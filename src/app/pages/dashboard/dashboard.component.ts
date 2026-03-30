import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SiwaDatePipe } from '../../../../projects/siwa-ui/src/lib/pipes/siwa-date.pipe';
import { DashboardFacade } from '../../core/store/dashboard/dashboard.facade';

@Component({
  selector: 'app-dashboard',
  imports: [TranslateModule, CardModule, TagModule, BadgeModule, TableModule, SiwaDatePipe],
  template: `
    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">{{ 'APP.DASHBOARD.TITLE' | translate }}</h1>
        <p-tag
          [value]="'APP.DASHBOARD.LIVE' | translate"
          [severity]="liveConnected() ? 'success' : 'secondary'"
          icon="pi pi-circle-fill"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <p-card>
          <div class="flex items-center gap-4">
            <div
              class="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <i class="pi pi-users text-primary text-xl"></i>
            </div>
            <div>
              <p class="text-surface-500 text-sm">{{ 'APP.DASHBOARD.TOTAL_USERS' | translate }}</p>
              <p class="text-2xl font-bold">{{ stats()?.totalUsers ?? '-' }}</p>
            </div>
          </div>
        </p-card>

        <p-card>
          <div class="flex items-center gap-4">
            <div
              class="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <i class="pi pi-desktop text-primary text-xl"></i>
            </div>
            <div>
              <p class="text-surface-500 text-sm">
                {{ 'APP.DASHBOARD.ACTIVE_THIS_WEEK' | translate }}
              </p>
              <p class="text-2xl font-bold">{{ stats()?.activeThisWeek ?? '-' }}</p>
            </div>
          </div>
        </p-card>

        <p-card>
          <div class="flex items-center gap-4">
            <div
              class="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <i class="pi pi-list-check text-primary text-xl"></i>
            </div>
            <div>
              <p class="text-surface-500 text-sm">
                {{ 'APP.DASHBOARD.AUDIT_LAST_24H' | translate }}
              </p>
              <p class="text-2xl font-bold">{{ stats()?.auditLast24h ?? '-' }}</p>
            </div>
          </div>
        </p-card>
      </div>

      <p-card [header]="'APP.DASHBOARD.RECENT_ACTIVITY' | translate">
        @if (stats()?.recentActivity?.length) {
          <p-table [value]="stats()!.recentActivity" [paginator]="false">
            <ng-template pTemplate="header">
              <tr>
                <th>{{ 'APP.DASHBOARD.COL_TIME' | translate }}</th>
                <th>{{ 'APP.DASHBOARD.COL_USER' | translate }}</th>
                <th>{{ 'APP.DASHBOARD.COL_ACTION' | translate }}</th>
                <th>{{ 'APP.DASHBOARD.COL_STATUS' | translate }}</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-item>
              <tr>
                <td class="text-sm whitespace-nowrap">
                  {{ item.timestamp | siwaDate: 'datetime' }}
                </td>
                <td class="text-sm">{{ item.userEmail ?? '-' }}</td>
                <td class="text-sm font-mono">{{ item.method }} {{ item.path }}</td>
                <td>
                  <p-tag
                    [value]="item.statusCode.toString()"
                    [severity]="item.statusCode < 400 ? 'success' : 'danger'"
                  />
                </td>
              </tr>
            </ng-template>
          </p-table>
        } @else {
          <p class="text-surface-500 italic text-sm">
            {{ 'APP.DASHBOARD.NO_ACTIVITY' | translate }}
          </p>
        }
      </p-card>

      @if (liveNotifications().length > 0) {
        <p-card [header]="'APP.DASHBOARD.LIVE_NOTIFICATIONS' | translate">
          <ul class="flex flex-col gap-2">
            @for (n of liveNotifications(); track n.time) {
              <li class="flex items-center gap-2 text-sm">
                <i class="pi pi-user-plus text-success"></i>
                <span
                  >{{ 'APP.DASHBOARD.NEW_USER_REGISTERED' | translate }}:
                  <strong>{{ n.email }}</strong></span
                >
                <span class="text-surface-400 text-xs ml-auto">{{
                  n.time | siwaDate: 'datetime'
                }}</span>
              </li>
            }
          </ul>
        </p-card>
      }
    </div>
  `,
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly dashboardFacade = inject(DashboardFacade);

  protected readonly stats = this.dashboardFacade.stats;
  protected readonly loading = this.dashboardFacade.loading;
  protected readonly liveNotifications = this.dashboardFacade.liveNotifications;
  protected readonly liveConnected = this.dashboardFacade.liveConnected;

  ngOnInit(): void {
    this.dashboardFacade.enterPage();
  }

  ngOnDestroy(): void {
    this.dashboardFacade.leavePage();
  }
}
