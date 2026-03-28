import { TestBed } from '@angular/core/testing';
import { AuthService, UserInfo } from './auth.service';

const mockUser: UserInfo = {
  id: 'user-1',
  email: 'test@example.com',
  firstName: 'Jan',
  lastName: 'Jansen',
  roles: ['Admin', 'User'],
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should start unauthenticated', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.getToken()).toBeNull();
    expect(service.currentUser()).toBeNull();
  });

  it('should set token and user on setToken()', () => {
    service.setToken('jwt-token', mockUser);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.getToken()).toBe('jwt-token');
    expect(service.currentUser()).toEqual(mockUser);
  });

  it('should clear token and user on clearToken()', () => {
    service.setToken('jwt-token', mockUser);
    service.clearToken();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.getToken()).toBeNull();
    expect(service.currentUser()).toBeNull();
  });

  it('should return true for existing role', () => {
    service.setToken('token', mockUser);
    expect(service.hasRole('Admin')).toBe(true);
  });

  it('should return false for non-existing role', () => {
    service.setToken('token', mockUser);
    expect(service.hasRole('SuperAdmin')).toBe(false);
  });

  it('should return false for role when not authenticated', () => {
    expect(service.hasRole('Admin')).toBe(false);
  });

  it('should return true for hasAnyRole when at least one role matches', () => {
    service.setToken('token', mockUser);
    expect(service.hasAnyRole(['SuperAdmin', 'Admin'])).toBe(true);
  });

  it('should return false for hasAnyRole when no roles match', () => {
    service.setToken('token', mockUser);
    expect(service.hasAnyRole(['SuperAdmin', 'Manager'])).toBe(false);
  });

  it('should NOT store token in localStorage', () => {
    service.setToken('geheim-token', mockUser);
    expect(localStorage.getItem('token')).toBeNull();
    expect(JSON.stringify(localStorage)).not.toContain('geheim-token');
  });
});
