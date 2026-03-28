import { TestBed } from '@angular/core/testing';
import { AuthStore } from './auth.store';
import { UserInfo } from '../auth/auth.service';

const mockUser: UserInfo = {
  id: 'user-1',
  email: 'test@example.com',
  firstName: 'Jan',
  lastName: 'Jansen',
  roles: ['Admin'],
};

describe('AuthStore', () => {
  let store: InstanceType<typeof AuthStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(AuthStore);
  });

  it('should start with empty state', () => {
    expect(store.user()).toBeNull();
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should set loading state', () => {
    store.setLoading(true);
    expect(store.isLoading()).toBe(true);
  });

  it('should set user and clear loading/error', () => {
    store.setLoading(true);
    store.setError('eerder fout');
    store.setUser(mockUser);
    expect(store.user()).toEqual(mockUser);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should set error and clear loading', () => {
    store.setLoading(true);
    store.setError('Ongeldige inloggegevens');
    expect(store.error()).toBe('Ongeldige inloggegevens');
    expect(store.isLoading()).toBe(false);
  });

  it('should reset state on logout', () => {
    store.setUser(mockUser);
    store.logout();
    expect(store.user()).toBeNull();
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });
});
