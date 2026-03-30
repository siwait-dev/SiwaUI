import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Layout, Theme } from '../../../../../projects/siwa-ui/src/lib/services/theme.service';

export const ThemeSettingsActions = createActionGroup({
  source: 'Theme Settings',
  events: {
    'Enter Page': emptyProps(),
    'Load Preferences': emptyProps(),
    'Load Preferences Success': props<{ theme: Theme; layout: Layout }>(),
    'Set Theme': props<{ theme: Theme }>(),
    'Set Layout': props<{ layout: Layout }>(),
  },
});
