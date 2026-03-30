import { createFeature, createReducer, on } from '@ngrx/store';
import { initialThemeState } from './theme.models';
import { themeStoreActions } from './theme.actions';

export const themeStoreFeature = createFeature({
  name: 'siwaUiTheme',
  reducer: createReducer(
    initialThemeState,
    on(themeStoreActions.setTheme, (state, { theme }) => ({
      ...state,
      theme,
    })),
    on(themeStoreActions.setLayout, (state, { layout }) => ({
      ...state,
      layout,
    })),
  ),
});
