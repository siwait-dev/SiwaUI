import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  fromEventPattern,
  catchError,
  exhaustMap,
  from,
  map,
  merge,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { SignalRService } from '../../services/signalr.service';
import { DashboardActions } from './dashboard.actions';
import { DashboardStats } from './dashboard.models';

interface UserRegisteredPayload {
  email: string;
  registeredAt: string;
}

@Injectable()
export class DashboardEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly api = inject(ApiService);
  private readonly signalR = inject(SignalRService);
  private readonly auth = inject(AuthService);

  readonly enterPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.enterPage),
      map(() => DashboardActions.loadStats()),
    ),
  );

  readonly loadStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadStats),
      exhaustMap(() =>
        this.api.get<DashboardStats>('dashboard/stats').pipe(
          map(stats => DashboardActions.loadStatsSuccess({ stats })),
          catchError(() => of(DashboardActions.loadStatsFailure())),
        ),
      ),
    ),
  );

  readonly connectLive$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.enterPage),
      exhaustMap(() => {
        if (!this.auth.isLoggedIn()) {
          return of(DashboardActions.liveConnectionFailed());
        }

        return from(this.signalR.connect()).pipe(
          switchMap(() => {
            const userRegistered$ = fromEventPattern<UserRegisteredPayload>(
              handler => this.signalR.on('UserRegistered', handler),
              () => this.signalR.off('UserRegistered'),
            ).pipe(
              map(payload =>
                DashboardActions.userRegistered({
                  email: payload.email,
                  registeredAt: payload.registeredAt,
                }),
              ),
            );

            return merge(of(DashboardActions.liveConnected()), userRegistered$);
          }),
          catchError(() => of(DashboardActions.liveConnectionFailed())),
        );
      }),
    ),
  );

  readonly leavePage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DashboardActions.leavePage),
        tap(() => {
          this.signalR.off('UserRegistered');
          void this.signalR.disconnect();
        }),
      ),
    { dispatch: false },
  );
}
