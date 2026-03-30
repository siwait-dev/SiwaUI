import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  Language,
  LocaleConfig,
} from '../../../../../projects/siwa-ui/src/lib/services/locale.service';

export const LocaleSettingsActions = createActionGroup({
  source: 'Locale Settings',
  events: {
    Bootstrap: emptyProps(),
    'Bootstrap Success': props<{ language: Language; config: LocaleConfig }>(),
    'Set Language': props<{ language: Language }>(),
    'Set Language Success': props<{ language: Language; config: LocaleConfig }>(),
  },
});
