import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { TableModule } from 'primeng/table';
import { ApiService } from '../../core/services/api.service';
import { SignalRService } from '../../core/services/signalr.service';
import { AuthService } from '../../core/services/auth.service';
import { SiwaDatePipe } from '../../../../projects/siwa-ui/src/lib/pipes/siwa-date.pipe';

interface DashboardStats {
  totalUsers: number;
  activeThisWeek: number;
  auditLast24h: number;
  recentActivity: RecentActivityItem[];
}

interface RecentActivityItem {
  timestamp: string;
  userEmail: string | null;
  method: string;
  path: string;
  statusCode: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TranslateModule, CardModule, TagModule, BadgeModule, TableModule, SiwaDatePipe],
  template: `
    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">{{ 'DASHBOARD.TITLE' | translate }}</h1>
        <p-tag [value]="'DASHBOARD.LIVE' | translate" severity="success" icon="pi pi-circle-fill" />
      </div>

      <!-- Stat cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <p-card>
          <div class="flex items-center gap-4">
            <div
              class="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <i class="pi pi-users text-primary text-xl"></i>
            </div>
            <div>
              <p class="text-surface-500 text-sm">{{ 'DASHBOARD.TOTAL_USERS' | translate }}</p>
              <p class="text-2xl font-bold">{{ stats()?.totalUsers ?? '–' }}</p>
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
              <p class="text-surface-500 text-sm">{{ 'DASHBOARD.ACTIVE_THIS_WEEK' | translate }}</p>
              <p class="text-2xl font-bold">{{ stats()?.activeThisWeek ?? '–' }}</p>
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
              <p class="text-surface-500 text-sm">{{ 'DASHBOARD.AUDIT_LAST_24H' | translate }}</p>
              <p class="text-2xl font-bold">{{ stats()?.auditLast24h ?? '–' }}</p>
            </div>
          </div>
        </p-card>
      </div>

      <!-- Recent activity -->
      <p-card [header]="'DASHBOARD.RECENT_ACTIVITY' | translate">
        @if (stats()?.recentActivity?.length) {
          <p-table [value]="stats()!.recentActivity" [paginator]="false">
            <ng-template pTemplate="header">
              <tr>
                <th>{{ 'DASHBOARD.COL_TIME' | translate }}</th>
                <th>{{ 'DASHBOARD.COL_USER' | translate }}</th>
                <th>{{ 'DASHBOARD.COL_ACTION' | translate }}</th>
                <th>{{ 'DASHBOARD.COL_STATUS' | translate }}</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-item>
              <tr>
                <td class="text-sm whitespace-nowrap">
                  {{ item.timestamp | siwaDate: 'datetime' }}
                </td>
                <td class="text-sm">{{ item.userEmail ?? '–' }}</td>
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
          <p class="text-surface-500 italic text-sm">{{ 'DASHBOARD.NO_ACTIVITY' | translate }}</p>
        }
      </p-card>

      <!-- Live notifications -->
      @if (liveNotifications().length > 0) {
        <p-card [header]="'DASHBOARD.LIVE_NOTIFICATIONS' | translate">
          <ul class="flex flex-col gap-2">
            @for (n of liveNotifications(); track n.time) {
              <li class="flex items-center gap-2 text-sm">
                <i class="pi pi-user-plus text-success"></i>
                <span
                  >{{ 'DASHBOARD.NEW_USER_REGISTERED' | translate }}:
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
  private readonly api = inject(ApiService);
  private readonly signalR = inject(SignalRService);
  private readonly auth = inject(AuthService);

  protected readonly stats = signal<DashboardStats | null>(null);
  protected readonly liveNotifications = signal<{ email: string; time: Date }[]>([]);

  async ngOnInit(): Promise<void> {
    // Load stats via REST
    this.api.get<DashboardStats>('dashboard/stats').subscribe({
      next: s => this.stats.set(s),
    });

    // Connect SignalR if logged in
    if (this.auth.isLoggedIn()) {
      try {
        await this.signalR.connect();

        // Listen for new user registrations (admins only — hub only sends to "admins" group)
        this.signalR.on('UserRegistered', (payload: unknown) => {
          const p = payload as { email: string; registeredAt: string };
          // Update total users live
          this.stats.update(s => (s ? { ...s, totalUsers: s.totalUsers + 1 } : s));
          // Add to live notifications
          this.liveNotifications.update(ns => [
            { email: p.email, time: new Date(p.registeredAt) },
            ...ns.slice(0, 9),
          ]);
        });
      } catch {
        // SignalR connection failed — dashboard still works without it
      }
    }
  }

  ngOnDestroy(): void {
    this.signalR.off('UserRegistered');
  }
}
