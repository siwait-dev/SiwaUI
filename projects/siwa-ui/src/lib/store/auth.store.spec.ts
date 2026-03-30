import { TestBed } from '@angular/core/testing';
import { provideState, provideStore } from '@ngrx/store';
import { UserInfo } from '../auth/auth.service';
import { AuthStoreFacade } from './auth/auth.facade';
import { authStoreFeature } from './auth/auth.reducer';

const mockUser: UserInfo = {
  id: 'user-1',
  email: 'test@example.com',
  firstName: 'Jan',
  lastName: 'Jansen',
  roles: ['Admin'],
};

describe('AuthStoreFacade', () => {
  let facade: AuthStoreFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideStore(), provideState(authStoreFeature)],
    });
    facade = TestBed.inject(AuthStoreFacade);
  });

  it('should start with empty state', () => {
    expect(facade.user()).toBeNull();
    expect(facade.isLoading()).toBe(false);
    expect(facade.error()).toBeNull();
  });

  it('should set loading state', () => {
    facade.setLoading(true);
    expect(facade.isLoading()).toBe(true);
  });

  it('should set user and clear loading/error', () => {
    facade.setLoading(true);
    facade.setError('eerder fout');
    facade.setUser(mockUser);
    expect(facade.user()).toEqual(mockUser);
    expect(facade.isLoading()).toBe(false);
    expect(facade.error()).toBeNull();
  });

  it('should set error and clear loading', () => {
    facade.setLoading(true);
    facade.setError('Ongeldige inloggegevens');
    expect(facade.error()).toBe('Ongeldige inloggegevens');
    expect(facade.isLoading()).toBe(false);
  });

  it('should reset state on logout', () => {
    facade.setUser(mockUser);
    facade.logout();
    expect(facade.user()).toBeNull();
    expect(facade.isLoading()).toBe(false);
    expect(facade.error()).toBeNull();
  });
});
