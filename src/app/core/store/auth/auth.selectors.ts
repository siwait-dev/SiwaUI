import { createSelector } from '@ngrx/store';
import { decodeJwt, isTokenExpired } from '../../state/auth/auth-session';
import { authFeature } from './auth.reducer';

export const selectAuthState = authFeature.selectAuthState;
export const selectAccessToken = authFeature.selectAccessToken;
export const selectRefreshToken = authFeature.selectRefreshToken;

export const selectIsLoggedIn = createSelector(
  selectAccessToken,
  accessToken => !!accessToken && !isTokenExpired(accessToken),
);

export const selectCurrentUser = createSelector(selectAccessToken, accessToken => {
  if (!accessToken || isTokenExpired(accessToken)) return null;
  return decodeJwt(accessToken);
});
