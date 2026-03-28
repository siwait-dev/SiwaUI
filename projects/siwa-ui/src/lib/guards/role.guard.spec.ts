import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthService } from '../auth/auth.service';

const makeRoute = (roles: string[]) => ({ data: { roles } }) as unknown as ActivatedRouteSnapshot;

describe('roleGuard', () => {
  let authService: AuthService;

  const runGuard = (roles: string[]) =>
    TestBed.runInInjectionContext(() => roleGuard(makeRoute(roles), {} as RouterStateSnapshot));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: { createUrlTree: (c: string[]) => c } }],
    });
    authService = TestBed.inject(AuthService);
    authService.setToken('token', {
      id: '1',
      email: 'a@b.com',
      firstName: 'A',
      lastName: 'B',
      roles: ['Admin'],
    });
  });

  it('should allow when no roles required', () => {
    expect(runGuard([])).toBe(true);
  });

  it('should allow when user has required role', () => {
    expect(runGuard(['Admin'])).toBe(true);
  });

  it('should allow when user has one of multiple required roles', () => {
    expect(runGuard(['Manager', 'Admin'])).toBe(true);
  });

  it('should redirect to /errors/403 when user lacks required role', () => {
    expect(runGuard(['SuperAdmin'])).toEqual(['/errors/403']);
  });
});
