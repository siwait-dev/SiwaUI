import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { FlatTranslationsResponse, TranslationDraft, TranslationRow } from './translations.models';

export const TranslationsActions = createActionGroup({
  source: 'Translations',
  events: {
    'Enter Page': emptyProps(),
    'Load Flat Translations': emptyProps(),
    'Load Flat Translations Success': props<{
      nl: FlatTranslationsResponse;
      en: FlatTranslationsResponse;
    }>(),
    'Load Flat Translations Failure': emptyProps(),
    'Save Translation': props<{ draft: TranslationDraft }>(),
    'Save Translation Success': props<{ row: TranslationRow }>(),
    'Save Translation Failure': props<{ errorKey: string }>(),
    'Delete Translation': props<{ row: TranslationRow }>(),
    'Delete Translation Success': props<{ key: string }>(),
    'Delete Translation Failure': props<{ errorKey: string }>(),
    'Clear Edit Error': emptyProps(),
    'Consume Feedback': emptyProps(),
  },
});
