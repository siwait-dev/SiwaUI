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

export interface UserListResponse {
  items: UserDto[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface UserRolesResponse {
  roles: string[];
}

export interface UsersQuery {
  page: number;
  pageSize: number;
  search: string;
  isActive: boolean | null;
}
