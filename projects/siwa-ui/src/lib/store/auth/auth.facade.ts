import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserInfo } from '../../auth/auth.service';
import { authStoreActions } from './auth.actions';
import { selectAuthError, selectAuthIsLoading, selectAuthUser } from './auth.selectors';

@Injectable({ providedIn: 'root' })
export class AuthStoreFacade {
  private readonly store = inject(Store);

  readonly user = this.store.selectSignal(selectAuthUser);
  readonly isLoading = this.store.selectSignal(selectAuthIsLoading);
  readonly error = this.store.selectSignal(selectAuthError);

  setLoading(isLoading: boolean): void {
    this.store.dispatch(authStoreActions.setLoading({ isLoading }));
  }

  setUser(user: UserInfo): void {
    this.store.dispatch(authStoreActions.setUser({ user }));
  }

  setError(error: string): void {
    this.store.dispatch(authStoreActions.setError({ error }));
  }

  logout(): void {
    this.store.dispatch(authStoreActions.logout());
  }
}
