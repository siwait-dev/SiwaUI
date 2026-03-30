import { TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { SignalRService } from '../../core/services/signalr.service';
import { DashboardEffects } from '../../core/store/dashboard/dashboard.effects';
import { dashboardFeature } from '../../core/store/dashboard/dashboard.reducer';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  const api = {
    get: vi.fn(),
  };

  let userRegisteredHandler: ((payload: unknown) => void) | null = null;

  const signalR = {
    connect: vi.fn(() => Promise.resolve()),
    on: vi.fn((method: string, callback: (payload: unknown) => void) => {
      if (method === 'UserRegistered') {
        userRegisteredHandler = callback;
      }
    }),
    off: vi.fn(() => {
      userRegisteredHandler = null;
    }),
    disconnect: vi.fn(() => Promise.resolve()),
  };

  const auth = {
    isLoggedIn: vi.fn(() => true),
  };

  const stats = {
    totalUsers: 42,
    activeThisWeek: 17,
    auditLast24h: 8,
    recentActivity: [
      {
        timestamp: '2026-03-30T10:00:00Z',
        userEmail: 'admin@example.com',
        method: 'POST',
        path: '/auth/login',
        statusCode: 200,
      },
    ],
  };

  beforeEach(async () => {
    userRegisteredHandler = null;
    api.get.mockReset();
    signalR.connect.mockClear();
    signalR.on.mockClear();
    signalR.off.mockClear();
    signalR.disconnect.mockClear();
    auth.isLoggedIn.mockClear();
    auth.isLoggedIn.mockReturnValue(true);
    api.get.mockReturnValue(of(stats));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, TranslateModule.forRoot()],
      providers: [
        provideStore(),
        provideState(dashboardFeature),
        provideEffects(DashboardEffects),
        { provide: ApiService, useValue: api },
        { provide: SignalRService, useValue: signalR },
        { provide: AuthService, useValue: auth },
      ],
    }).compileComponents();
  });

  it('loads dashboard stats on init', async () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(api.get).toHaveBeenCalledWith('dashboard/stats');
    expect(fixture.componentInstance['stats']()?.totalUsers).toBe(42);
  });

  it('connects SignalR on init when logged in', async () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(signalR.connect).toHaveBeenCalled();
    expect(signalR.on).toHaveBeenCalledWith('UserRegistered', expect.any(Function));
  });

  it('updates stats and live notifications when a user registers', async () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    userRegisteredHandler?.({
      email: 'new.user@example.com',
      registeredAt: '2026-03-30T12:00:00Z',
    });
    await fixture.whenStable();

    expect(fixture.componentInstance['stats']()?.totalUsers).toBe(43);
    expect(fixture.componentInstance['liveNotifications']()[0]?.email).toBe('new.user@example.com');
  });
});
