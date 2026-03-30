import { createFeature, createReducer, on } from '@ngrx/store';
import { TranslationsActions } from './translations.actions';
import { TranslationRow, TranslationsFeedback } from './translations.models';

export interface TranslationsState {
  rows: TranslationRow[];
  loading: boolean;
  saving: boolean;
  editError: string | null;
  feedback: TranslationsFeedback | null;
}

const initialState: TranslationsState = {
  rows: [],
  loading: true,
  saving: false,
  editError: null,
  feedback: null,
};

function mergeFlatTranslations(
  nlResponse: Record<string, string>,
  enResponse: Record<string, string>,
): TranslationRow[] {
  const keys = new Set([...Object.keys(nlResponse), ...Object.keys(enResponse)]);

  return Array.from(keys)
    .sort()
    .map(key => ({
      key,
      nl: nlResponse[key] ?? '',
      en: enResponse[key] ?? '',
    }));
}

export const translationsFeature = createFeature({
  name: 'translations',
  reducer: createReducer(
    initialState,
    on(TranslationsActions.loadFlatTranslations, state => ({
      ...state,
      loading: true,
    })),
    on(TranslationsActions.loadFlatTranslationsSuccess, (state, { nl, en }) => {
      const nlData = nl.translations ?? (nl as unknown as Record<string, string>);
      const enData = en.translations ?? (en as unknown as Record<string, string>);

      return {
        ...state,
        rows: mergeFlatTranslations(nlData, enData),
        loading: false,
      };
    }),
    on(TranslationsActions.loadFlatTranslationsFailure, state => ({
      ...state,
      loading: false,
    })),
    on(TranslationsActions.saveTranslation, state => ({
      ...state,
      saving: true,
      editError: null,
    })),
    on(TranslationsActions.saveTranslationSuccess, (state, { row }) => {
      const withoutExisting = state.rows.filter(existing => existing.key !== row.key);

      return {
        ...state,
        rows: [...withoutExisting, row].sort((a, b) => a.key.localeCompare(b.key)),
        saving: false,
        feedback: { kind: 'saved' },
      };
    }),
    on(TranslationsActions.saveTranslationFailure, (state, { errorKey }) => ({
      ...state,
      saving: false,
      editError: errorKey,
    })),
    on(TranslationsActions.deleteTranslationSuccess, (state, { key }) => ({
      ...state,
      rows: state.rows.filter(existing => existing.key !== key),
      feedback: { kind: 'deleted' },
    })),
    on(TranslationsActions.deleteTranslationFailure, (state, { errorKey }) => ({
      ...state,
      feedback: { kind: 'delete-failed', messageKey: errorKey },
    })),
    on(TranslationsActions.clearEditError, state => ({
      ...state,
      editError: null,
    })),
    on(TranslationsActions.consumeFeedback, state => ({
      ...state,
      feedback: null,
    })),
  ),
});
