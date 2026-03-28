import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { UserInfo } from '../auth/auth.service';

interface AuthState {
  user: UserInfo | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(store => ({
    setLoading(isLoading: boolean) {
      patchState(store, { isLoading });
    },
    setUser(user: UserInfo) {
      patchState(store, { user, isLoading: false, error: null });
    },
    setError(error: string) {
      patchState(store, { error, isLoading: false });
    },
    logout() {
      patchState(store, initialState);
    },
  })),
);
