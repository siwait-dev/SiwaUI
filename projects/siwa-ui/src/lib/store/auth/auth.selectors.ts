import { createSelector } from '@ngrx/store';
import { authStoreFeature } from './auth.reducer';

export const selectAuthUser = createSelector(authStoreFeature.selectUser, user => user);
export const selectAuthIsLoading = createSelector(
  authStoreFeature.selectIsLoading,
  isLoading => isLoading,
);
export const selectAuthError = createSelector(authStoreFeature.selectError, error => error);
