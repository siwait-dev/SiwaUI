import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { of } from 'rxjs';
import { AuthEffects } from '../store/auth/auth.effects';
import { authFeature } from '../store/auth/auth.reducer';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';

function createToken(overrides: Record<string, unknown> = {}): string {
  const toBase64Url = (value: object): string =>
    btoa(JSON.stringify(value)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');

  const header = toBase64Url({ alg: 'HS256', typ: 'JWT' });
  const payload = toBase64Url({
    sub: '1',
    email: 'test@test.nl',
    name: 'Test User',
    exp: 4070908800,
    ...overrides,
  });

  return `${header}.${payload}.signature`;
}

describe('AuthService', () => {
  const api = {
    post: vi.fn(),
  };

  beforeEach(async () => {
    localStorage.clear();
    api.post.mockReset();

    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideStore(),
        provideState(authFeature),
        provideEffects(AuthEffects),
        AuthService,
        {
          provide: ApiService,
          useValue: api,
        },
        {
          provide: Router,
          useValue: {
            navigate: vi.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compileComponents();
  });

  it('stores tokens in localStorage and exposes them through the service', () => {
    const service = TestBed.inject(AuthService);
    const accessToken = createToken();

    service.storeTokens(accessToken, 'refresh-token');

    expect(localStorage.getItem('siwa-token')).toBe(accessToken);
    expect(localStorage.getItem('siwa-refresh-token')).toBe('refresh-token');
    expect(service.getAccessToken()).toBe(accessToken);
    expect(service.getRefreshToken()).toBe('refresh-token');
    expect(service.isLoggedIn()).toBe(true);
    expect(service.currentUser()?.email).toBe('test@test.nl');
  });

  it('clears both localStorage and store-backed session state on logout', () => {
    api.post.mockReturnValue(of(void 0));

    const service = TestBed.inject(AuthService);
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    const accessToken = createToken();

    service.storeTokens(accessToken, 'refresh-token');
    service.logout();

    expect(api.post).toHaveBeenCalledWith('auth/logout', { refreshToken: 'refresh-token' });
    expect(localStorage.getItem('siwa-token')).toBeNull();
    expect(localStorage.getItem('siwa-refresh-token')).toBeNull();
    expect(service.getAccessToken()).toBeNull();
    expect(service.getRefreshToken()).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
