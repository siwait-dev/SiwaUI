import { inject, Pipe, PipeTransform } from '@angular/core';
import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { LocaleService } from '../services/locale.service';

/**
 * SiwaCurrencyPipe — locale-aware currency formatting.
 *
 * Resolves 'symbol' / 'symbol-narrow' / 'code' to the actual display string
 * using Angular's getCurrencySymbol(), so the output is correct for each locale.
 *
 * NL:  € 1.234,56
 * EN:  €1,234.56
 *
 * @example
 * {{ invoice.total | siwaCurrency }}             // € 1.234,56 (NL)
 * {{ invoice.total | siwaCurrency:'USD':'code' }} // USD 1.234,56 (NL)
 */
@Pipe({ name: 'siwaCurrency', pure: false })
export class SiwaCurrencyPipe implements PipeTransform {
  private readonly localeService = inject(LocaleService);

  /**
   * @param value        - The amount to format
   * @param currencyCode - ISO 4217 code, defaults to locale config (EUR)
   * @param display      - 'symbol' | 'symbol-narrow' | 'code' | custom string (defaults to 'symbol')
   * @param digitsInfo   - Angular digitsInfo string, defaults to '1.2-2'
   */
  transform(
    value: number | null | undefined,
    currencyCode?: string,
    display: 'code' | 'symbol' | 'symbol-narrow' | string = 'symbol',
    digitsInfo = '1.2-2',
  ): string {
    if (value == null) return '';

    const locale = this.localeService.locale();
    const code = currencyCode ?? this.localeService.currencyCode();
    const currencyDisplay = this.resolveDisplay(display, code, locale);

    try {
      return formatCurrency(value, locale, currencyDisplay, code, digitsInfo);
    } catch {
      return String(value);
    }
  }

  /**
   * Resolves the display mode to the actual string to show in the output.
   * formatCurrency() expects the literal display string (e.g. '€'), not a mode flag.
   */
  private resolveDisplay(display: string, code: string, locale: string): string {
    switch (display) {
      case 'symbol':
        return getCurrencySymbol(code, 'wide', locale) ?? code;
      case 'symbol-narrow':
        return getCurrencySymbol(code, 'narrow', locale) ?? code;
      case 'code':
        return code;
      default:
        return display; // custom string (e.g. 'Fr.', 'kr')
    }
  }
}
