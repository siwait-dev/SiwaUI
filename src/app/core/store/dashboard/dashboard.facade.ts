import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { DashboardActions } from './dashboard.actions';
import {
  selectLiveConnected,
  selectLiveNotifications,
  selectLoading,
  selectStats,
} from './dashboard.selectors';

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  private readonly store = inject(Store);

  readonly stats = this.store.selectSignal(selectStats);
  readonly loading = this.store.selectSignal(selectLoading);
  readonly liveNotifications = this.store.selectSignal(selectLiveNotifications);
  readonly liveConnected = this.store.selectSignal(selectLiveConnected);

  enterPage(): void {
    this.store.dispatch(DashboardActions.enterPage());
  }

  leavePage(): void {
    this.store.dispatch(DashboardActions.leavePage());
  }
}
