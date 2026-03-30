import { createFeature, createReducer, on } from '@ngrx/store';
import { AppSettingsActions } from './app-settings.actions';
import { AppConfigDto, AppSettingsFeedback } from './app-settings.models';

export interface AppSettingsState {
  config: AppConfigDto;
  loading: boolean;
  saving: boolean;
  feedback: AppSettingsFeedback | null;
}

const defaultConfig: AppConfigDto = {
  appName: 'SiwaUI',
  idleTimeoutEnabled: true,
  idleTimeoutMinutes: 30,
};

const initialState: AppSettingsState = {
  config: defaultConfig,
  loading: true,
  saving: false,
  feedback: null,
};

export const appSettingsFeature = createFeature({
  name: 'appSettings',
  reducer: createReducer(
    initialState,
    on(AppSettingsActions.loadSettings, state => ({
      ...state,
      loading: true,
    })),
    on(AppSettingsActions.loadSettingsSuccess, (state, { config }) => ({
      ...state,
      config,
      loading: false,
    })),
    on(AppSettingsActions.loadSettingsFailure, state => ({
      ...state,
      loading: false,
    })),
    on(AppSettingsActions.updateDraft, (state, { patch }) => ({
      ...state,
      config: {
        ...state.config,
        ...patch,
      },
    })),
    on(AppSettingsActions.saveSettings, state => ({
      ...state,
      saving: true,
      feedback: null,
    })),
    on(AppSettingsActions.saveSettingsSuccess, (state, { config }) => ({
      ...state,
      config,
      saving: false,
      feedback: { kind: 'saved' },
    })),
    on(AppSettingsActions.saveSettingsFailure, state => ({
      ...state,
      saving: false,
      feedback: { kind: 'save-failed' },
    })),
    on(AppSettingsActions.setFeedback, (state, { feedback }) => ({
      ...state,
      feedback,
    })),
    on(AppSettingsActions.consumeFeedback, state => ({
      ...state,
      feedback: null,
    })),
  ),
});
