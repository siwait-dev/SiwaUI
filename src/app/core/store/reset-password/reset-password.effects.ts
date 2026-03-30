import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { PasswordPolicyService } from '../../services/password-policy.service';
import { ResetPasswordActions } from './reset-password.actions';

@Injectable()
export class ResetPasswordEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly policyService = inject(PasswordPolicyService);

  readonly enterPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResetPasswordActions.enterPage),
      map(() => ResetPasswordActions.loadPolicy()),
    ),
  );

  readonly loadPolicy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResetPasswordActions.loadPolicy),
      switchMap(() =>
        this.policyService.getPolicy().pipe(
          map(() => ResetPasswordActions.loadPolicySuccess()),
          catchError(() => of(ResetPasswordActions.loadPolicyFailure())),
        ),
      ),
    ),
  );

  readonly submit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResetPasswordActions.submit),
      mergeMap(({ email, token, newPassword }) =>
        this.authService.resetPassword({ email, token, newPassword }).pipe(
          map(() => ResetPasswordActions.submitSuccess()),
          catchError((err: { status?: number }) =>
            of(
              ResetPasswordActions.submitFailure({
                errorKey:
                  err?.status === 400 || err?.status === 404
                    ? 'VALIDATION.INVALID_RESET_TOKEN'
                    : 'VALIDATION.SERVER_ERROR',
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
        ofType(ResetPasswordActions.submitSuccess),
        tap(
          () =>
            void this.router.navigate(['/login'], {
              queryParams: { reset: 'success' },
            }),
        ),
      ),
    { dispatch: false },
  );
}
