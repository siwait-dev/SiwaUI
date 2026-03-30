export interface TranslationRow {
  key: string;
  nl: string;
  en: string;
}

import { TranslationDictionaryResponse } from '../../models/api.models';

export type FlatTranslationsResponse = TranslationDictionaryResponse;

export interface TranslationDraft {
  key: string;
  module: string;
  nl: string;
  en: string;
}

export interface TranslationsFeedback {
  kind: 'saved' | 'deleted' | 'delete-failed';
  messageKey?: string;
}
