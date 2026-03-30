import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ForgotPasswordActions } from './forgot-password.actions';

@Injectable()
export class ForgotPasswordEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);

  readonly submit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ForgotPasswordActions.submit),
      mergeMap(({ email }) =>
        this.authService.forgotPassword({ email }).pipe(
          map(() => ForgotPasswordActions.submitSuccess()),
          catchError(() =>
            of(ForgotPasswordActions.submitFailure({ errorKey: 'VALIDATION.SERVER_ERROR' })),
          ),
        ),
      ),
    ),
  );
}
