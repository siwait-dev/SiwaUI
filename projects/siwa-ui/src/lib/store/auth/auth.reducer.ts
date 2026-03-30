import { createFeature, createReducer, on } from '@ngrx/store';
import { authStoreActions } from './auth.actions';
import { initialAuthState } from './auth.models';

export const authStoreFeature = createFeature({
  name: 'siwaUiAuth',
  reducer: createReducer(
    initialAuthState,
    on(authStoreActions.setLoading, (state, { isLoading }) => ({
      ...state,
      isLoading,
    })),
    on(authStoreActions.setUser, (state, { user }) => ({
      ...state,
      user,
      isLoading: false,
      error: null,
    })),
    on(authStoreActions.setError, (state, { error }) => ({
      ...state,
      error,
      isLoading: false,
    })),
    on(authStoreActions.logout, () => initialAuthState),
  ),
});
