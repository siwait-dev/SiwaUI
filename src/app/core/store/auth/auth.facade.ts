import { computed, inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import {
  selectAccessToken,
  selectCurrentUser,
  selectIsLoggedIn,
  selectRefreshToken,
} from './auth.selectors';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly store = inject(Store);

  readonly accessToken = this.store.selectSignal(selectAccessToken);
  readonly refreshToken = this.store.selectSignal(selectRefreshToken);
  readonly isLoggedIn = this.store.selectSignal(selectIsLoggedIn);
  readonly currentUser = this.store.selectSignal(selectCurrentUser);
  readonly currentUserRoles = computed(() => this.currentUser()?.roles ?? []);

  bootstrapSession(): void {
    this.store.dispatch(AuthActions.bootstrapSession());
  }

  setSession(accessToken: string, refreshToken: string): void {
    this.store.dispatch(AuthActions.setSession({ accessToken, refreshToken }));
  }

  clearSession(redirect = false): void {
    this.store.dispatch(AuthActions.clearSession({ redirect }));
  }
}
