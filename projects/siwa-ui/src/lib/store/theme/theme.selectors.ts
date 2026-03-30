import { createSelector } from '@ngrx/store';
import { themeStoreFeature } from './theme.reducer';

export const selectThemeValue = createSelector(themeStoreFeature.selectTheme, theme => theme);
export const selectLayoutValue = createSelector(themeStoreFeature.selectLayout, layout => layout);
