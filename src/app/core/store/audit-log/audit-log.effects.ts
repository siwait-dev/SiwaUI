import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { AuditLogActions } from './audit-log.actions';
import { AuditPagedResponse } from './audit-log.models';
import { selectAuditLogQuery } from './audit-log.selectors';

@Injectable()
export class AuditLogEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly api = inject(ApiService);

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
      mergeMap(([, query]) => {
        const params: Record<string, string | number | boolean> = {
          page: query.page,
          pageSize: query.pageSize,
        };

        if (query.method) params['method'] = query.method;
        if (query.email) params['email'] = query.email;
        if (query.path) params['path'] = query.path;
        if (query.from) params['from'] = new Date(query.from).toISOString();
        if (query.to) params['to'] = new Date(query.to).toISOString();

        return this.api.get<AuditPagedResponse>('audit', params).pipe(
          map(response => AuditLogActions.loadLogsSuccess({ response })),
          catchError(() => of(AuditLogActions.loadLogsFailure())),
        );
      }),
    ),
  );
}
