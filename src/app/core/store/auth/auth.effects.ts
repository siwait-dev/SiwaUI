import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, tap } from 'rxjs';
import { REFRESH_TOKEN_KEY, TOKEN_KEY } from '../../state/auth/auth-session';
import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly router = inject(Router);

  readonly bootstrapSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.bootstrapSession),
      map(() => {
        const accessToken = localStorage.getItem(TOKEN_KEY);
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

        return accessToken && refreshToken
          ? AuthActions.setSession({ accessToken, refreshToken })
          : AuthActions.clearSession({ redirect: false });
      }),
    ),
  );

  readonly persistSession$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.setSession),
        tap(({ accessToken, refreshToken }) => {
          localStorage.setItem(TOKEN_KEY, accessToken);
          localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }),
      ),
    { dispatch: false },
  );

  readonly clearSession$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.clearSession),
        tap(() => {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
        }),
      ),
    { dispatch: false },
  );

  readonly redirectAfterLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.clearSession),
        filter(({ redirect }) => redirect),
        tap(() => {
          void this.router.navigate(['/login']);
        }),
      ),
    { dispatch: false },
  );
}
