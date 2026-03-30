import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { AuditLogApiService } from '../../services/audit-log-api.service';
import { AuditLogActions } from './audit-log.actions';
import { AuditPagedResponse } from './audit-log.models';
import { selectAuditLogQuery } from './audit-log.selectors';

@Injectable()
export class AuditLogEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly auditLogApi = inject(AuditLogApiService);

  readonly enterPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuditLogActions.enterPage),
      map(() => AuditLogActions.loadLogs()),
    ),
  );

  readonly reloadOnQueryChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        AuditLogActions.setMethodFilter,
        AuditLogActions.setEmailFilter,
        AuditLogActions.setPathFilter,
        AuditLogActions.setDateRange,
        AuditLogActions.clearFilters,
        AuditLogActions.setPage,
      ),
      map(() => AuditLogActions.loadLogs()),
    ),
  );

  readonly loadLogs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuditLogActions.loadLogs),
      withLatestFrom(this.store.select(selectAuditLogQuery)),
      mergeMap(([, query]) =>
        this.auditLogApi.getLogs<AuditPagedResponse>(query).pipe(
          map(response => AuditLogActions.loadLogsSuccess({ response })),
          catchError(() => of(AuditLogActions.loadLogsFailure())),
        ),
      ),
    ),
  );
}
