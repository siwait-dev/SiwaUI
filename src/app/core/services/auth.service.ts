import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserClaims } from '../state/auth/auth-session';
import { AuthFacade } from '../store/auth/auth.facade';
import { ApiService } from './api.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ActivateRequest {
  email: string;
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  mustChangePassword?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly authFacade = inject(AuthFacade);

  readonly isLoggedIn = this.authFacade.isLoggedIn;
  readonly currentUser = this.authFacade.currentUser as () => UserClaims | null;

  getRefreshToken(): string | null {
    return this.authFacade.refreshToken();
  }

  getAccessToken(): string | null {
    return this.authFacade.accessToken();
  }

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.api
      .post<AuthResponse>('auth/login', req)
      .pipe(tap(res => this.storeTokens(res.accessToken, res.refreshToken)));
  }

  refreshAccessToken(refreshToken: string): Observable<AuthResponse> {
    return this.api
      .post<AuthResponse>('auth/refresh', { refreshToken })
      .pipe(tap(res => this.storeTokens(res.accessToken, res.refreshToken)));
  }

  register(req: RegisterRequest): Observable<void> {
    return this.api.post<void>('auth/register', req);
  }

  activate(req: ActivateRequest): Observable<void> {
    return this.api.post<void>('auth/activate', req);
  }

  forgotPassword(req: ForgotPasswordRequest): Observable<void> {
    return this.api.post<void>('auth/forgot-password', req);
  }

  resetPassword(req: ResetPasswordRequest): Observable<void> {
    return this.api.post<void>('auth/reset-password', req);
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();

    if (refreshToken) {
      this.api.post<void>('auth/logout', { refreshToken }).subscribe({ error: () => {} });
    }

    this.authFacade.clearSession(true);
  }

  storeTokens(accessToken: string, refreshToken: string): void {
    this.authFacade.setSession(accessToken, refreshToken);
  }
}
