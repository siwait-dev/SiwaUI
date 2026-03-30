import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { ApiErrorService } from '../../services/api-error.service';
import { AuthService } from '../../services/auth.service';
import { LoginActions } from './login.actions';

@Injectable()
export class LoginEffects {
  private readonly actions$ = inject(Actions);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly apiErrorService = inject(ApiErrorService);

  readonly submit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoginActions.submit),
      mergeMap(({ email, password }) =>
        this.authService.login({ email, password }).pipe(
          map(response =>
            LoginActions.submitSuccess({ mustChangePassword: !!response.mustChangePassword }),
          ),
          catchError(error =>
            of(
              LoginActions.submitFailure({
                errorKey: this.apiErrorService.getMessageKey(
                  error,
                  'VALIDATION.INVALID_CREDENTIALS',
                ),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  readonly navigateAfterSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LoginActions.submitSuccess),
        tap(({ mustChangePassword }) => {
          if (mustChangePassword) {
            void this.router.navigate(['/app/change-password'], {
              queryParams: { reason: 'expired' },
            });
            return;
          }

          void this.router.navigate(['/app/dashboard']);
        }),
      ),
    { dispatch: false },
  );
}
