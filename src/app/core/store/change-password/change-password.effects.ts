import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, delay, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { AuthAccountApiService } from '../../services/auth-account-api.service';
import { PasswordPolicyService } from '../../services/password-policy.service';
import { ChangePasswordActions } from './change-password.actions';

@Injectable()
export class ChangePasswordEffects {
  private readonly actions$ = inject(Actions);
  private readonly authAccountApi = inject(AuthAccountApiService);
  private readonly router = inject(Router);
  private readonly policyService = inject(PasswordPolicyService);

  readonly enterPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChangePasswordActions.enterPage),
      map(() => ChangePasswordActions.loadPolicy()),
    ),
  );

  readonly loadPolicy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChangePasswordActions.loadPolicy),
      switchMap(() =>
        this.policyService.getPolicy().pipe(
          map(() => ChangePasswordActions.loadPolicySuccess()),
          catchError(() => of(ChangePasswordActions.loadPolicyFailure())),
        ),
      ),
    ),
  );

  readonly submit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChangePasswordActions.submit),
      mergeMap(({ currentPassword, newPassword }) =>
        this.authAccountApi.changePassword({ currentPassword, newPassword }).pipe(
          map(() => ChangePasswordActions.submitSuccess()),
          catchError((err: { status?: number }) =>
            of(
              ChangePasswordActions.submitFailure({
                errorKey:
                  err?.status === 400
                    ? 'VALIDATION.INVALID_CREDENTIALS'
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
        ofType(ChangePasswordActions.submitSuccess),
        delay(1500),
        tap(() => void this.router.navigate(['/app/dashboard'])),
      ),
    { dispatch: false },
  );
}
