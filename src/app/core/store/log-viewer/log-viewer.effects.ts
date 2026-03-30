import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { LogViewerActions } from './log-viewer.actions';
import { ClientLogPagedResponse } from './log-viewer.models';
import { selectLogViewerQuery } from './log-viewer.selectors';

@Injectable()
export class LogViewerEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly api = inject(ApiService);

  readonly enterPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LogViewerActions.enterPage),
      map(() => LogViewerActions.loadLogs()),
    ),
  );

  readonly reloadOnQueryChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        LogViewerActions.setLevelFilter,
        LogViewerActions.setUserFilter,
        LogViewerActions.setCorrelationFilter,
        LogViewerActions.setDateRange,
        LogViewerActions.clearFilters,
        LogViewerActions.setPage,
      ),
      map(() => LogViewerActions.loadLogs()),
    ),
  );

  readonly loadLogs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LogViewerActions.loadLogs),
      withLatestFrom(this.store.select(selectLogViewerQuery)),
      mergeMap(([, query]) => {
        const params: Record<string, string | number | boolean> = {
          page: query.page,
          pageSize: query.pageSize,
        };

        if (query.level) params['level'] = query.level;
        if (query.userId) params['userId'] = query.userId;
        if (query.correlationId) params['correlationId'] = query.correlationId;
        if (query.from) params['from'] = new Date(query.from).toISOString();
        if (query.to) params['to'] = new Date(query.to).toISOString();

        return this.api.get<ClientLogPagedResponse>('logs/client', params).pipe(
          map(response => LogViewerActions.loadLogsSuccess({ response })),
          catchError(() => of(LogViewerActions.loadLogsFailure())),
        );
      }),
    ),
  );
}
