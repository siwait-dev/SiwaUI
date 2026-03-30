import { createFeature, createReducer, on } from '@ngrx/store';
import { ThemeSettingsActions } from './theme-settings.actions';
import { ThemeSettingsStateModel } from './theme-settings.models';

const initialState: ThemeSettingsStateModel = {
  theme: 'light',
  layout: 'sidebar',
  loading: true,
};

export const themeSettingsFeature = createFeature({
  name: 'themeSettings',
  reducer: createReducer(
    initialState,
    on(ThemeSettingsActions.loadPreferences, state => ({
      ...state,
      loading: true,
    })),
    on(ThemeSettingsActions.loadPreferencesSuccess, (state, { theme, layout }) => ({
      ...state,
      theme,
      layout,
      loading: false,
    })),
    on(ThemeSettingsActions.setTheme, (state, { theme }) => ({
      ...state,
      theme,
    })),
    on(ThemeSettingsActions.setLayout, (state, { layout }) => ({
      ...state,
      layout,
    })),
  ),
});
