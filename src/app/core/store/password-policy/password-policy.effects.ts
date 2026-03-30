import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { PasswordPolicyApiService } from '../../services/password-policy-api.service';
import { PasswordPolicyActions } from './password-policy.actions';
import { PasswordPolicyModel } from './password-policy.models';
import { selectPolicy } from './password-policy.selectors';

@Injectable()
export class PasswordPolicyEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly passwordPolicyApi = inject(PasswordPolicyApiService);

  readonly enterPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PasswordPolicyActions.enterPage),
      map(() => PasswordPolicyActions.loadPolicy()),
    ),
  );

  readonly loadPolicy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PasswordPolicyActions.loadPolicy),
      mergeMap(() =>
        this.passwordPolicyApi.getPolicy<PasswordPolicyModel>().pipe(
          map(policy => PasswordPolicyActions.loadPolicySuccess({ policy })),
          catchError(() => of(PasswordPolicyActions.loadPolicyFailure())),
        ),
      ),
    ),
  );

  readonly savePolicy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PasswordPolicyActions.savePolicy),
      withLatestFrom(this.store.select(selectPolicy)),
      mergeMap(([, policy]) =>
        this.passwordPolicyApi.updatePolicy(policy).pipe(
          map(savedPolicy => PasswordPolicyActions.savePolicySuccess({ policy: savedPolicy })),
          catchError(() => of(PasswordPolicyActions.savePolicyFailure())),
        ),
      ),
    ),
  );
}
