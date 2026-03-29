import { inject, Injectable, signal, computed } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Language = 'nl' | 'en';

export interface LocaleConfig {
  /** IETF locale tag used by Angular formatting functions (formatDate, formatNumber, …). */
  locale: string;
  /** Default short date format for this locale. */
  dateFormat: string;
  /** Default date + time format for this locale. */
  dateTimeFormat: string;
  /** ISO 4217 currency code. */
  currencyCode: string;
  /** Display symbol for the currency. */
  currencySymbol: string;
}

const LOCALE_MAP: Record<Language, LocaleConfig> = {
  nl: {
    locale: 'nl-NL',
    dateFormat: 'dd-MM-yyyy',
    dateTimeFormat: 'dd-MM-yyyy HH:mm',
    currencyCode: 'EUR',
    currencySymbol: '€',
  },
  en: {
    locale: 'en-GB',
    dateFormat: 'dd/MM/yyyy',
    dateTimeFormat: 'dd/MM/yyyy HH:mm',
    currencyCode: 'EUR',
    currencySymbol: '€',
  },
};

/**
 * LocaleService — single source of truth for language + locale.
 *
 * Coordinates:
 *  - ngx-translate (UI text)
 *  - Angular locale for date / number / currency formatting
 *
 * Usage:
 *  localeService.setLanguage('en');
 *  {{ price | siwaCurrency }}   ← picks up locale automatically
 */
@Injectable({ providedIn: 'root' })
export class LocaleService {
  private static readonly STORAGE_KEY = 'siwa-language';

  private readonly translate = inject(TranslateService);

  /** Currently active language. */
  readonly language = signal<Language>(LocaleService.loadLanguage());

  /** Full locale config derived from the active language. */
  readonly config = computed<LocaleConfig>(() => LOCALE_MAP[this.language()]);

  /** IETF locale string (e.g. 'nl-NL', 'en-GB'). */
  readonly locale = computed(() => this.config().locale);

  /** Short date format string (e.g. 'dd-MM-yyyy'). */
  readonly dateFormat = computed(() => this.config().dateFormat);

  /** Date + time format string (e.g. 'dd-MM-yyyy HH:mm'). */
  readonly dateTimeFormat = computed(() => this.config().dateTimeFormat);

  /** ISO currency code (e.g. 'EUR'). */
  readonly currencyCode = computed(() => this.config().currencyCode);

  /** Currency display symbol (e.g. '€'). */
  readonly currencySymbol = computed(() => this.config().currencySymbol);

  /**
   * Call once during app bootstrap (in App constructor).
   * Sets the default + active language in ngx-translate.
   */
  init(): void {
    this.translate.setDefaultLang('nl');
    this.translate.use(this.language());
  }

  /**
   * Switch language at runtime.
   * Updates the signal, ngx-translate and persists to localStorage.
   */
  setLanguage(lang: Language): void {
    this.language.set(lang);
    localStorage.setItem(LocaleService.STORAGE_KEY, lang);
    this.translate.use(lang);
  }

  private static loadLanguage(): Language {
    return (localStorage.getItem(LocaleService.STORAGE_KEY) as Language) ?? 'nl';
  }
}
