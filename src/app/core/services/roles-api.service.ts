import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface RoleClaimMutationRequest {
  roleName: string;
  type: string;
  value: string;
}

@Injectable({ providedIn: 'root' })
export class RolesApiService {
  private readonly api = inject(ApiService);

  getRoles(): Observable<{ roles: string[] }> {
    return this.api.get<{ roles: string[] }>('roles');
  }

  createRole(name: string): Observable<unknown> {
    return this.api.post<unknown>('roles', { name });
  }

  deleteRole(role: string): Observable<unknown> {
    return this.api.delete<unknown>(`roles/${role}`);
  }

  getRoleClaims<T>(role: string): Observable<T> {
    return this.api.get<T>(`roles/${encodeURIComponent(role)}/claims`);
  }

  addRoleClaim(role: string, claimType: string, claimValue: string): Observable<unknown> {
    const request: RoleClaimMutationRequest = {
      roleName: role,
      type: claimType,
      value: claimValue,
    };

    return this.api.post<unknown>(`roles/${encodeURIComponent(role)}/claims`, request);
  }

  removeRoleClaim(role: string, claimType: string, claimValue: string): Observable<unknown> {
    const request: RoleClaimMutationRequest = {
      roleName: role,
      type: claimType,
      value: claimValue,
    };

    return this.api.delete<unknown>(`roles/${encodeURIComponent(role)}/claims`, request);
  }
}
