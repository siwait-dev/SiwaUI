import { JWT_EXPIRY_SKEW_SECONDS, SECONDS_TO_MILLISECONDS } from '../../constants/timing.constants';

export interface UserClaims {
  sub: string;
  email: string;
  name: string;
  roles: string[];
  exp: number;
}

export const TOKEN_KEY = 'siwa-token';
export const REFRESH_TOKEN_KEY = 'siwa-refresh-token';

export function decodeJwt(token: string): UserClaims | null {
  try {
    const part = token.split('.')[1];
    const padded = part + '='.repeat((4 - (part.length % 4)) % 4);
    const json = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
    const claims = JSON.parse(json) as Record<string, unknown>;

    const roleRaw =
      claims['role'] ?? claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    return {
      sub: String(claims['sub'] ?? ''),
      email: String(claims['email'] ?? ''),
      name: String(
        claims['name'] ??
          claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ??
          '',
      ),
      roles: Array.isArray(roleRaw) ? roleRaw.map(String) : roleRaw ? [String(roleRaw)] : [],
      exp: Number(claims['exp'] ?? 0),
    };
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const claims = decodeJwt(token);
  if (!claims) return true;

  return Date.now() / SECONDS_TO_MILLISECONDS > claims.exp - JWT_EXPIRY_SKEW_SECONDS;
}
