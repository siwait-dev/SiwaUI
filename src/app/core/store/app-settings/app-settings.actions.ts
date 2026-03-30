import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AppConfigDto, AppSettingsFeedback } from './app-settings.models';

export const AppSettingsActions = createActionGroup({
  source: 'App Settings',
  events: {
    'Enter Page': emptyProps(),
    'Load Settings': emptyProps(),
    'Load Settings Success': props<{ config: AppConfigDto }>(),
    'Load Settings Failure': emptyProps(),
    'Update Draft': props<{ patch: Partial<AppConfigDto> }>(),
    'Save Settings': emptyProps(),
    'Save Settings Success': props<{ config: AppConfigDto }>(),
    'Save Settings Failure': emptyProps(),
    'Consume Feedback': emptyProps(),
    'Set Feedback': props<{ feedback: AppSettingsFeedback }>(),
  },
});
