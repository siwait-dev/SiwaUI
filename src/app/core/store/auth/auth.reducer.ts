import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(AuthActions.setSession, (state, { accessToken, refreshToken }) => ({
      ...state,
      accessToken,
      refreshToken,
    })),
    on(AuthActions.clearSession, () => initialState),
  ),
});
