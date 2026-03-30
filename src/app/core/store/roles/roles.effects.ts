import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ApiErrorService } from '../../services/api-error.service';
import { ApiService } from '../../services/api.service';
import { RolesActions } from './roles.actions';
import { RoleClaimsResponse } from './roles.models';

@Injectable()
export class RolesEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(ApiService);
  private readonly apiError = inject(ApiErrorService);

  readonly enterPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.enterPage),
      map(() => RolesActions.loadRoles()),
    ),
  );

  readonly loadRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.loadRoles),
      mergeMap(() =>
        this.api.get<{ roles: string[] }>('roles').pipe(
          map(response => RolesActions.loadRolesSuccess({ roles: response.roles ?? [] })),
          catchError(() => of(RolesActions.loadRolesFailure())),
        ),
      ),
    ),
  );

  readonly createRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.createRole),
      mergeMap(({ name }) =>
        this.api.post<unknown>('roles', { name }).pipe(
          map(() => RolesActions.createRoleSuccess({ role: name })),
          catchError(error =>
            of(
              RolesActions.createRoleFailure({
                errorKey: this.apiError.getMessageKey(error, 'ADMIN.ROLES.ERRORS.CREATE_FAILED'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  readonly deleteRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.deleteRole),
      mergeMap(({ role }) =>
        this.api.delete<unknown>(`roles/${role}`).pipe(
          map(() => RolesActions.deleteRoleSuccess({ role })),
          catchError(error =>
            of(
              RolesActions.deleteRoleFailure({
                errorKey: this.apiError.getMessageKey(error, 'ADMIN.ROLES.ERRORS.DELETE_FAILED'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  readonly openClaimsDialog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.openClaimsDialog),
      mergeMap(({ role }) =>
        this.api.get<RoleClaimsResponse>(`roles/${encodeURIComponent(role)}/claims`).pipe(
          map(response => RolesActions.loadClaimsSuccess({ role, claims: response.claims ?? [] })),
          catchError(error =>
            of(
              RolesActions.loadClaimsFailure({
                errorKey: this.apiError.getMessageKey(
                  error,
                  'ADMIN.ROLES.ERRORS.CLAIMS_LOAD_FAILED',
                ),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  readonly addClaim$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.addClaim),
      mergeMap(({ role, claimType, claimValue }) =>
        this.api
          .post<unknown>(`roles/${encodeURIComponent(role)}/claims`, {
            roleName: role,
            type: claimType,
            value: claimValue,
          })
          .pipe(
            map(() =>
              RolesActions.addClaimSuccess({
                role,
                claim: { type: claimType, value: claimValue },
              }),
            ),
            catchError(error =>
              of(
                RolesActions.addClaimFailure({
                  errorKey: this.apiError.getMessageKey(
                    error,
                    'ADMIN.ROLES.ERRORS.CLAIM_ADD_FAILED',
                  ),
                }),
              ),
            ),
          ),
      ),
    ),
  );

  readonly removeClaim$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.removeClaim),
      mergeMap(({ role, claim }) =>
        this.api
          .delete<unknown>(`roles/${encodeURIComponent(role)}/claims`, {
            roleName: role,
            type: claim.type,
            value: claim.value,
          })
          .pipe(
            map(() => RolesActions.removeClaimSuccess({ role, claim })),
            catchError(error =>
              of(
                RolesActions.removeClaimFailure({
                  errorKey: this.apiError.getMessageKey(
                    error,
                    'ADMIN.ROLES.ERRORS.CLAIM_REMOVE_FAILED',
                  ),
                }),
              ),
            ),
          ),
      ),
    ),
  );
}
