import { PagedQuery, PagedResponse } from '../../models/api.models';

export interface UserDto {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  emailConfirmed: boolean;
  roles: string[];
  createdAt: string;
  lastLoginAt?: string;
}

export type UserListResponse = PagedResponse<UserDto>;

export interface UserRolesResponse {
  roles: string[];
}

export interface UsersQuery extends PagedQuery {
  search: string;
  isActive: boolean | null;
}
