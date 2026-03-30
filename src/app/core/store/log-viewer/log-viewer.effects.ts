import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { ClientLogsApiService } from '../../services/client-logs-api.service';
import { LogViewerActions } from './log-viewer.actions';
import { ClientLogPagedResponse } from './log-viewer.models';
import { selectLogViewerQuery } from './log-viewer.selectors';

@Injectable()
export class LogViewerEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly clientLogsApi = inject(ClientLogsApiService);

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
      mergeMap(([, query]) =>
        this.clientLogsApi.getLogs<ClientLogPagedResponse>(query).pipe(
          map(response => LogViewerActions.loadLogsSuccess({ response })),
          catchError(() => of(LogViewerActions.loadLogsFailure())),
        ),
      ),
    ),
  );
}
