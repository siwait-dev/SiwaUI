import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LogViewerActions } from './log-viewer.actions';
import {
  selectCorrelationId,
  selectFrom,
  selectLevel,
  selectLoading,
  selectLogs,
  selectPageSize,
  selectTo,
  selectTotalCount,
  selectUserId,
} from './log-viewer.selectors';

@Injectable({ providedIn: 'root' })
export class LogViewerFacade {
  private readonly store = inject(Store);

  readonly logs = this.store.selectSignal(selectLogs);
  readonly totalCount = this.store.selectSignal(selectTotalCount);
  readonly loading = this.store.selectSignal(selectLoading);
  readonly selectedLevel = this.store.selectSignal(selectLevel);
  readonly filterUserId = this.store.selectSignal(selectUserId);
  readonly filterCorrelationId = this.store.selectSignal(selectCorrelationId);
  readonly filterFrom = this.store.selectSignal(selectFrom);
  readonly filterTo = this.store.selectSignal(selectTo);
  readonly pageSize = this.store.selectSignal(selectPageSize);

  enterPage(): void {
    this.store.dispatch(LogViewerActions.enterPage());
  }

  setLevelFilter(level: string | null): void {
    this.store.dispatch(LogViewerActions.setLevelFilter({ level }));
  }

  setUserFilter(userId: string): void {
    this.store.dispatch(LogViewerActions.setUserFilter({ userId }));
  }

  setCorrelationFilter(correlationId: string): void {
    this.store.dispatch(LogViewerActions.setCorrelationFilter({ correlationId }));
  }

  setDateRange(from: string, to: string): void {
    this.store.dispatch(LogViewerActions.setDateRange({ from, to }));
  }

  clearFilters(): void {
    this.store.dispatch(LogViewerActions.clearFilters());
  }

  setPage(page: number, pageSize: number): void {
    this.store.dispatch(LogViewerActions.setPage({ page, pageSize }));
  }
}
