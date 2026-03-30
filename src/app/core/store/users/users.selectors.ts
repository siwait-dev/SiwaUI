import { createSelector } from '@ngrx/store';
import { usersFeature } from './users.reducer';

export const {
  selectItems: selectUsersItems,
  selectTotalCount: selectUsersTotalCount,
  selectLoading: selectUsersLoading,
  selectPage: selectUsersPage,
  selectPageSize: selectUsersPageSize,
  selectSearch: selectUsersSearch,
  selectIsActive: selectUsersStatusFilter,
  selectAllRoles: selectAllRoles,
  selectRolesDialogUser: selectRolesDialogUser,
  selectRolesLoading: selectRolesLoading,
  selectRolesError: selectRolesError,
} = usersFeature;

export const selectUsersQuery = createSelector(
  selectUsersPage,
  selectUsersPageSize,
  selectUsersSearch,
  selectUsersStatusFilter,
  (page, pageSize, search, isActive) => ({
    page,
    pageSize,
    search,
    isActive,
  }),
);
