import { createFeature, createReducer, on } from '@ngrx/store';
import { LocaleSettingsActions } from './locale-settings.actions';
import { LocaleSettingsStateModel } from './locale-settings.models';

const initialState: LocaleSettingsStateModel = {
  language: 'nl',
  config: {
    locale: 'nl-NL',
    dateFormat: 'dd-MM-yyyy',
    dateTimeFormat: 'dd-MM-yyyy HH:mm',
    currencyCode: 'EUR',
    currencySymbol: 'EUR',
  },
  loading: true,
};

export const localeSettingsFeature = createFeature({
  name: 'localeSettings',
  reducer: createReducer(
    initialState,
    on(LocaleSettingsActions.bootstrap, state => ({
      ...state,
      loading: true,
    })),
    on(LocaleSettingsActions.bootstrapSuccess, (state, { language, config }) => ({
      ...state,
      language,
      config,
      loading: false,
    })),
    on(LocaleSettingsActions.setLanguageSuccess, (state, { language, config }) => ({
      ...state,
      language,
      config,
      loading: false,
    })),
  ),
});
