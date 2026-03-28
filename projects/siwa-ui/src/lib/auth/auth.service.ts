import { Injectable, signal } from '@angular/core';

export interface UserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Token wordt in-memory bewaard (niet in localStorage) voor betere beveiliging
  private accessToken: string | null = null;
  readonly currentUser = signal<UserInfo | null>(null);

  setToken(token: string, user: UserInfo): void {
    this.accessToken = token;
    this.currentUser.set(user);
  }

  clearToken(): void {
    this.accessToken = null;
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return this.accessToken;
  }

  isAuthenticated(): boolean {
    return this.accessToken !== null;
  }

  hasRole(role: string): boolean {
    return this.currentUser()?.roles.includes(role) ?? false;
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(r => this.hasRole(r));
  }
}
