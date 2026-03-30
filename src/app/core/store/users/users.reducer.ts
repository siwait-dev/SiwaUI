import { createFeature, createReducer, on } from '@ngrx/store';
import { UsersActions } from './users.actions';
import { UserDto } from './users.models';
import { DEFAULT_PAGE_NUMBER, USERS_PAGE_SIZE } from '../../constants/paging.constants';

export interface UsersState {
  items: UserDto[];
  totalCount: number;
  loading: boolean;
  page: number;
  pageSize: number;
  search: string;
  isActive: boolean | null;
  allRoles: string[];
  rolesDialogUser: UserDto | null;
  rolesLoading: boolean;
  rolesError: string | null;
}

const initialState: UsersState = {
  items: [],
  totalCount: 0,
  loading: true,
  page: DEFAULT_PAGE_NUMBER,
  pageSize: USERS_PAGE_SIZE,
  search: '',
  isActive: null,
  allRoles: [],
  rolesDialogUser: null,
  rolesLoading: false,
  rolesError: null,
};

function syncUser(items: UserDto[], userId: string, update: (user: UserDto) => UserDto): UserDto[] {
  return items.map(user => (user.userId === userId ? update(user) : user));
}

export const usersFeature = createFeature({
  name: 'users',
  reducer: createReducer(
    initialState,
    on(UsersActions.loadUsers, state => ({
      ...state,
      loading: true,
    })),
    on(UsersActions.loadUsersSuccess, (state, { response }) => ({
      ...state,
      items: response.items,
      totalCount: response.totalCount,
      page: response.page,
      pageSize: response.pageSize,
      loading: false,
    })),
    on(UsersActions.loadUsersFailure, state => ({
      ...state,
      loading: false,
    })),
    on(UsersActions.setSearch, (state, { search }) => ({
      ...state,
      search,
      page: DEFAULT_PAGE_NUMBER,
    })),
    on(UsersActions.setStatusFilter, (state, { isActive }) => ({
      ...state,
      isActive,
      page: DEFAULT_PAGE_NUMBER,
    })),
    on(UsersActions.setPage, (state, { page, pageSize }) => ({
      ...state,
      page,
      pageSize,
    })),
    on(UsersActions.loadRolesSuccess, (state, { roles }) => ({
      ...state,
      allRoles: roles,
    })),
    on(UsersActions.openRolesDialog, (state, { user }) => ({
      ...state,
      rolesDialogUser: { ...user, roles: [] },
      rolesLoading: true,
      rolesError: null,
    })),
    on(UsersActions.closeRolesDialog, state => ({
      ...state,
      rolesDialogUser: null,
      rolesLoading: false,
      rolesError: null,
    })),
    on(UsersActions.loadUserRolesSuccess, (state, { userId, roles }) => {
      const updatedItems = syncUser(state.items, userId, user => ({ ...user, roles: [...roles] }));
      const dialogUser =
        state.rolesDialogUser?.userId === userId
          ? { ...state.rolesDialogUser, roles: [...roles] }
          : state.rolesDialogUser;

      return {
        ...state,
        items: updatedItems,
        rolesDialogUser: dialogUser,
        rolesLoading: false,
      };
    }),
    on(UsersActions.loadUserRolesFailure, (state, { errorKey }) => ({
      ...state,
      rolesLoading: false,
      rolesError: errorKey,
    })),
    on(UsersActions.addUserRole, UsersActions.removeUserRole, state => ({
      ...state,
      rolesError: null,
    })),
    on(UsersActions.addUserRoleSuccess, (state, { userId, role }) => {
      const updatedItems = syncUser(state.items, userId, user => ({
        ...user,
        roles: user.roles.includes(role) ? user.roles : [...user.roles, role],
      }));
      const dialogUser =
        state.rolesDialogUser?.userId === userId
          ? {
              ...state.rolesDialogUser,
              roles: state.rolesDialogUser.roles.includes(role)
                ? state.rolesDialogUser.roles
                : [...state.rolesDialogUser.roles, role],
            }
          : state.rolesDialogUser;

      return {
        ...state,
        items: updatedItems,
        rolesDialogUser: dialogUser,
      };
    }),
    on(UsersActions.removeUserRoleSuccess, (state, { userId, role }) => {
      const updatedItems = syncUser(state.items, userId, user => ({
        ...user,
        roles: user.roles.filter(existing => existing !== role),
      }));
      const dialogUser =
        state.rolesDialogUser?.userId === userId
          ? {
              ...state.rolesDialogUser,
              roles: state.rolesDialogUser.roles.filter(existing => existing !== role),
            }
          : state.rolesDialogUser;

      return {
        ...state,
        items: updatedItems,
        rolesDialogUser: dialogUser,
      };
    }),
    on(
      UsersActions.addUserRoleFailure,
      UsersActions.removeUserRoleFailure,
      (state, { errorKey }) => ({
        ...state,
        rolesError: errorKey,
      }),
    ),
    on(UsersActions.clearRolesError, state => ({
      ...state,
      rolesError: null,
    })),
  ),
});
