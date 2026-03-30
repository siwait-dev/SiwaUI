import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { decodeJwt, isTokenExpired, REFRESH_TOKEN_KEY, TOKEN_KEY } from './auth-session';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
};

const initialState: AuthState = {
  accessToken: localStorage.getItem(TOKEN_KEY),
  refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ accessToken }) => ({
    isLoggedIn: computed(() => {
      const token = accessToken();
      return !!token && !isTokenExpired(token);
    }),
    currentUser: computed(() => {
      const token = accessToken();
      if (!token || isTokenExpired(token)) return null;
      return decodeJwt(token);
    }),
  })),
  withMethods(store => ({
    setSession(accessToken: string, refreshToken: string): void {
      patchState(store, { accessToken, refreshToken });
    },
    clearSession(): void {
      patchState(store, { accessToken: null, refreshToken: null });
    },
  })),
);
