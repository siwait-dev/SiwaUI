import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { ApiErrorService } from '../../services/api-error.service';
import { ApiService } from '../../services/api.service';
import { UsersActions } from './users.actions';
import { UserListResponse, UserRolesResponse } from './users.models';
import { selectUsersQuery } from './users.selectors';

@Injectable()
export class UsersEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly api = inject(ApiService);
  private readonly apiError = inject(ApiErrorService);

  readonly enterPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.enterPage),
      mergeMap(() => [UsersActions.loadRoles(), UsersActions.loadUsers()]),
    ),
  );

  readonly reloadUsersOnQueryChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.setSearch, UsersActions.setStatusFilter, UsersActions.setPage),
      map(() => UsersActions.loadUsers()),
    ),
  );

  readonly loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      withLatestFrom(this.store.select(selectUsersQuery)),
      mergeMap(([, query]) => {
        const params: Record<string, string | number | boolean> = {
          page: query.page,
          pageSize: query.pageSize,
        };

        if (query.search) {
          params['search'] = query.search;
        }

        if (query.isActive !== null) {
          params['isActive'] = query.isActive;
        }

        return this.api.get<UserListResponse>('users', params).pipe(
          map(response => UsersActions.loadUsersSuccess({ response })),
          catchError(() => of(UsersActions.loadUsersFailure())),
        );
      }),
    ),
  );

  readonly loadRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadRoles),
      mergeMap(() =>
        this.api.get<{ roles: string[] }>('roles').pipe(
          map(response => UsersActions.loadRolesSuccess({ roles: response.roles ?? [] })),
          catchError(() => of(UsersActions.loadRolesFailure())),
        ),
      ),
    ),
  );

  readonly openRolesDialog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.openRolesDialog),
      mergeMap(({ user }) =>
        this.api.get<UserRolesResponse>(`users/${user.userId}/roles`).pipe(
          map(response =>
            UsersActions.loadUserRolesSuccess({ userId: user.userId, roles: response.roles ?? [] }),
          ),
          catchError(error =>
            of(
              UsersActions.loadUserRolesFailure({
                errorKey: this.apiError.getMessageKey(
                  error,
                  'ADMIN.USERS.ERRORS.ROLES_LOAD_FAILED',
                ),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  readonly addUserRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.addUserRole),
      mergeMap(({ userId, role }) =>
        this.api.post<unknown>(`users/${userId}/roles`, { userId, roleName: role }).pipe(
          map(() => UsersActions.addUserRoleSuccess({ userId, role })),
          catchError(error =>
            of(
              UsersActions.addUserRoleFailure({
                errorKey: this.apiError.getMessageKey(error, 'ADMIN.USERS.ERRORS.ROLE_SAVE_FAILED'),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  readonly removeUserRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.removeUserRole),
      mergeMap(({ userId, role }) =>
        this.api.delete<unknown>(`users/${userId}/roles/${role}`).pipe(
          map(() => UsersActions.removeUserRoleSuccess({ userId, role })),
          catchError(error =>
            of(
              UsersActions.removeUserRoleFailure({
                errorKey: this.apiError.getMessageKey(
                  error,
                  'ADMIN.USERS.ERRORS.ROLE_REMOVE_FAILED',
                ),
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
