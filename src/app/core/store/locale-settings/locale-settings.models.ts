import {
  Language,
  LocaleConfig,
} from '../../../../../projects/siwa-ui/src/lib/services/locale.service';

export interface LocaleSettingsStateModel {
  language: Language;
  config: LocaleConfig;
  loading: boolean;
}
