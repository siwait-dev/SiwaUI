import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';

// ── Request / Response types ──────────────────────────────────────────────────

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

export interface UserClaims {
  sub: string;
  email: string;
  name: string;
  roles: string[];
  exp: number;
}

// ── JWT decoder (no external library) ────────────────────────────────────────

function decodeJwt(token: string): UserClaims | null {
  try {
    const part = token.split('.')[1];
    const padded = part + '='.repeat((4 - (part.length % 4)) % 4);
    const json = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c: any = JSON.parse(json);

    const roleRaw = c['role'] ?? c['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    return {
      sub: String(c['sub'] ?? ''),
      email: String(c['email'] ?? ''),
      name: String(
        c['name'] ?? c['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ?? '',
      ),
      roles: Array.isArray(roleRaw) ? (roleRaw as string[]) : roleRaw ? [String(roleRaw)] : [],
      exp: Number(c['exp'] ?? 0),
    };
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const claims = decodeJwt(token);
  if (!claims) return true;
  // exp is in seconds; add 5s leeway for clock skew
  return Date.now() / 1000 > claims.exp - 5;
}

// ── Service ───────────────────────────────────────────────────────────────────

const TOKEN_KEY = 'siwa-token';
const REFRESH_TOKEN_KEY = 'siwa-refresh-token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  private readonly _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  /** `true` wanneer er een niet-verlopen access-token in localStorage staat. */
  readonly isLoggedIn = computed(() => {
    const t = this._token();
    return !!t && !isTokenExpired(t);
  });

  /** Decoded JWT-claims van de ingelogde gebruiker, of `null`. */
  readonly currentUser = computed<UserClaims | null>(() => {
    const t = this._token();
    if (!t || isTokenExpired(t)) return null;
    return decodeJwt(t);
  });

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  // ── Auth-acties ─────────────────────────────────────────────────────────────

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
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    // Fire-and-forget revoke — niet wachten op resultaat
    if (refreshToken) {
      this.api.post<void>('auth/logout', { refreshToken }).subscribe({ error: () => {} });
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    this._token.set(null);
    void this.router.navigate(['/login']);
  }

  // ── Token opslag ─────────────────────────────────────────────────────────────

  storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    this._token.set(accessToken);
  }
}
