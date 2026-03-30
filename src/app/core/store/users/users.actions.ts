import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { UserDto, UserListResponse } from './users.models';

export const UsersActions = createActionGroup({
  source: 'Users',
  events: {
    'Enter Page': emptyProps(),
    'Load Users': emptyProps(),
    'Load Users Success': props<{ response: UserListResponse }>(),
    'Load Users Failure': emptyProps(),
    'Load Roles': emptyProps(),
    'Load Roles Success': props<{ roles: string[] }>(),
    'Load Roles Failure': emptyProps(),
    'Set Search': props<{ search: string }>(),
    'Set Status Filter': props<{ isActive: boolean | null }>(),
    'Set Page': props<{ page: number; pageSize: number }>(),
    'Open Roles Dialog': props<{ user: UserDto }>(),
    'Close Roles Dialog': emptyProps(),
    'Load User Roles Success': props<{ userId: string; roles: string[] }>(),
    'Load User Roles Failure': props<{ errorKey: string }>(),
    'Add User Role': props<{ userId: string; role: string }>(),
    'Add User Role Success': props<{ userId: string; role: string }>(),
    'Add User Role Failure': props<{ errorKey: string }>(),
    'Remove User Role': props<{ userId: string; role: string }>(),
    'Remove User Role Success': props<{ userId: string; role: string }>(),
    'Remove User Role Failure': props<{ errorKey: string }>(),
    'Clear Roles Error': emptyProps(),
  },
});
