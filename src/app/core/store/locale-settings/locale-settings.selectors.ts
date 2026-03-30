import { createSelector } from '@ngrx/store';
import { localeSettingsFeature } from './locale-settings.reducer';

export const { selectLanguage, selectConfig, selectLoading } = localeSettingsFeature;

export const selectLocale = createSelector(selectConfig, config => config.locale);
export const selectDateFormat = createSelector(selectConfig, config => config.dateFormat);
export const selectDateTimeFormat = createSelector(selectConfig, config => config.dateTimeFormat);
export const selectCurrencyCode = createSelector(selectConfig, config => config.currencyCode);
export const selectCurrencySymbol = createSelector(selectConfig, config => config.currencySymbol);
