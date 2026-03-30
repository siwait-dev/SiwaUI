import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuditLogActions } from './audit-log.actions';
import {
  selectEmail,
  selectFrom,
  selectLoading,
  selectLogs,
  selectMethod,
  selectPageSize,
  selectPath,
  selectTo,
  selectTotalCount,
} from './audit-log.selectors';

@Injectable({ providedIn: 'root' })
export class AuditLogFacade {
  private readonly store = inject(Store);

  readonly logs = this.store.selectSignal(selectLogs);
  readonly totalCount = this.store.selectSignal(selectTotalCount);
  readonly loading = this.store.selectSignal(selectLoading);
  readonly selectedMethod = this.store.selectSignal(selectMethod);
  readonly filterEmail = this.store.selectSignal(selectEmail);
  readonly filterPath = this.store.selectSignal(selectPath);
  readonly filterFrom = this.store.selectSignal(selectFrom);
  readonly filterTo = this.store.selectSignal(selectTo);
  readonly pageSize = this.store.selectSignal(selectPageSize);

  enterPage(): void {
    this.store.dispatch(AuditLogActions.enterPage());
  }

  setMethodFilter(method: string | null): void {
    this.store.dispatch(AuditLogActions.setMethodFilter({ method }));
  }

  setEmailFilter(email: string): void {
    this.store.dispatch(AuditLogActions.setEmailFilter({ email }));
  }

  setPathFilter(path: string): void {
    this.store.dispatch(AuditLogActions.setPathFilter({ path }));
  }

  setDateRange(from: string, to: string): void {
    this.store.dispatch(AuditLogActions.setDateRange({ from, to }));
  }

  clearFilters(): void {
    this.store.dispatch(AuditLogActions.clearFilters());
  }

  setPage(page: number, pageSize: number): void {
    this.store.dispatch(AuditLogActions.setPage({ page, pageSize }));
  }
}
