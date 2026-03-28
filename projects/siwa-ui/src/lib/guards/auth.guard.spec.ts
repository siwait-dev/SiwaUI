import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../auth/auth.service';

describe('authGuard', () => {
  let authService: AuthService;

  const runGuard = () =>
    TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: { createUrlTree: (commands: string[]) => commands } },
      ],
    });
    authService = TestBed.inject(AuthService);
  });

  it('should allow access when authenticated', () => {
    authService.setToken('token', {
      id: '1',
      email: 'a@b.com',
      firstName: 'A',
      lastName: 'B',
      roles: [],
    });
    expect(runGuard()).toBe(true);
  });

  it('should redirect to /auth/login when not authenticated', () => {
    const result = runGuard();
    expect(result).toEqual(['/auth/login']);
  });
});
