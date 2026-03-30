import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { ApiErrorService } from '../../services/api-error.service';
import { AuthService } from '../../services/auth.service';
import { PasswordPolicyService } from '../../services/password-policy.service';
import { RegisterActions } from './register.actions';

@Injectable()
export class RegisterEffects {
  private readonly actions$ = inject(Actions);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly policyService = inject(PasswordPolicyService);

  readonly enterPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegisterActions.enterPage),
      map(() => RegisterActions.loadPolicy()),
    ),
  );

  readonly loadPolicy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegisterActions.loadPolicy),
      switchMap(() =>
        this.policyService.getPolicy().pipe(
          map(() => RegisterActions.loadPolicySuccess()),
          catchError(() => of(RegisterActions.loadPolicyFailure())),
        ),
      ),
    ),
  );

  readonly submit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegisterActions.submit),
      mergeMap(({ firstName, lastName, email, password }) =>
        this.authService.register({ firstName, lastName, email, password }).pipe(
          map(() => RegisterActions.submitSuccess({ email })),
          catchError(error =>
            of(
              RegisterActions.submitFailure({
                errorKey: this.apiErrorService.getMessageKey(error, 'VALIDATION.SERVER_ERROR'),
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
        ofType(RegisterActions.submitSuccess),
        tap(({ email }) => void this.router.navigate(['/activate'], { queryParams: { email } })),
      ),
    { dispatch: false },
  );
}
