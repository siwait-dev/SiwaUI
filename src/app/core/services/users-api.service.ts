import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiQueryParams, PagedQuery } from '../models/api.models';
import { ApiService } from './api.service';

export interface UsersListQuery extends PagedQuery {
  search: string;
  isActive: boolean | null;
}

export interface UserRoleAssignmentRequest {
  userId: string;
  roleName: string;
}

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private readonly api = inject(ApiService);

  getUsers<T>(query: UsersListQuery): Observable<T> {
    const params: ApiQueryParams = {
      page: query.page,
      pageSize: query.pageSize,
    };

    if (query.search) {
      params['search'] = query.search;
    }

    if (query.isActive !== null) {
      params['isActive'] = query.isActive;
    }

    return this.api.get<T>('users', params);
  }

  getAvailableRoles(): Observable<{ roles: string[] }> {
    return this.api.get<{ roles: string[] }>('roles');
  }

  getUserRoles<T>(userId: string): Observable<T> {
    return this.api.get<T>(`users/${userId}/roles`);
  }

  addUserRole(userId: string, role: string): Observable<unknown> {
    const request: UserRoleAssignmentRequest = {
      userId,
      roleName: role,
    };

    return this.api.post<unknown>(`users/${userId}/roles`, request);
  }

  removeUserRole(userId: string, role: string): Observable<unknown> {
    return this.api.delete<unknown>(`users/${userId}/roles/${role}`);
  }
}
