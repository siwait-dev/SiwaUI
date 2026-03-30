import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Language } from '../../../../../projects/siwa-ui/src/lib/services/locale.service';
import { LocaleSettingsActions } from './locale-settings.actions';
import {
  selectConfig,
  selectCurrencyCode,
  selectCurrencySymbol,
  selectDateFormat,
  selectDateTimeFormat,
  selectLanguage,
  selectLoading,
  selectLocale,
} from './locale-settings.selectors';

@Injectable({ providedIn: 'root' })
export class LocaleSettingsFacade {
  private readonly store = inject(Store);

  readonly language = this.store.selectSignal(selectLanguage);
  readonly config = this.store.selectSignal(selectConfig);
  readonly locale = this.store.selectSignal(selectLocale);
  readonly dateFormat = this.store.selectSignal(selectDateFormat);
  readonly dateTimeFormat = this.store.selectSignal(selectDateTimeFormat);
  readonly currencyCode = this.store.selectSignal(selectCurrencyCode);
  readonly currencySymbol = this.store.selectSignal(selectCurrencySymbol);
  readonly loading = this.store.selectSignal(selectLoading);

  bootstrap(): void {
    this.store.dispatch(LocaleSettingsActions.bootstrap());
  }

  setLanguage(language: Language): void {
    this.store.dispatch(LocaleSettingsActions.setLanguage({ language }));
  }
}
