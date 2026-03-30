import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { UsersActions } from './users.actions';
import { UserDto } from './users.models';
import {
  selectAllRoles,
  selectRolesDialogUser,
  selectRolesError,
  selectRolesLoading,
  selectUsersItems,
  selectUsersLoading,
  selectUsersSearch,
  selectUsersStatusFilter,
  selectUsersTotalCount,
} from './users.selectors';

@Injectable({ providedIn: 'root' })
export class UsersFacade {
  private readonly store = inject(Store);

  readonly users = this.store.selectSignal(selectUsersItems);
  readonly totalCount = this.store.selectSignal(selectUsersTotalCount);
  readonly loading = this.store.selectSignal(selectUsersLoading);
  readonly search = this.store.selectSignal(selectUsersSearch);
  readonly selectedStatus = this.store.selectSignal(selectUsersStatusFilter);
  readonly allRoles = this.store.selectSignal(selectAllRoles);
  readonly rolesDialogUser = this.store.selectSignal(selectRolesDialogUser);
  readonly rolesLoading = this.store.selectSignal(selectRolesLoading);
  readonly rolesError = this.store.selectSignal(selectRolesError);

  enterPage(): void {
    this.store.dispatch(UsersActions.enterPage());
  }

  setSearch(search: string): void {
    this.store.dispatch(UsersActions.setSearch({ search }));
  }

  setStatusFilter(isActive: boolean | null): void {
    this.store.dispatch(UsersActions.setStatusFilter({ isActive }));
  }

  setPage(page: number, pageSize: number): void {
    this.store.dispatch(UsersActions.setPage({ page, pageSize }));
  }

  openRolesDialog(user: UserDto): void {
    this.store.dispatch(UsersActions.openRolesDialog({ user }));
  }

  closeRolesDialog(): void {
    this.store.dispatch(UsersActions.closeRolesDialog());
  }

  addUserRole(userId: string, role: string): void {
    this.store.dispatch(UsersActions.addUserRole({ userId, role }));
  }

  removeUserRole(userId: string, role: string): void {
    this.store.dispatch(UsersActions.removeUserRole({ userId, role }));
  }

  clearRolesError(): void {
    this.store.dispatch(UsersActions.clearRolesError());
  }
}
