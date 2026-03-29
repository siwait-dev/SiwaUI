import { inject, Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '@angular/common';
import { LocaleService } from '../services/locale.service';

/**
 * SiwaNumberPipe — locale-aware number formatting.
 *
 * NL:  1.234,56   (period = thousands, comma = decimal)
 * EN:  1,234.56   (comma = thousands, period = decimal)
 *
 * @example
 * {{ 1234.5 | siwaNumber }}             // '1.234,5'  (NL)
 * {{ 1234.5 | siwaNumber:'1.2-2' }}     // '1.234,50' (NL)
 */
@Pipe({ name: 'siwaNumber', pure: false })
export class SiwaNumberPipe implements PipeTransform {
  private readonly localeService = inject(LocaleService);

  /**
   * @param value   - The number to format
   * @param digitsInfo - Angular digitsInfo string, e.g. '1.0-2' (default)
   */
  transform(value: number | null | undefined, digitsInfo = '1.0-2'): string {
    if (value == null) return '';

    try {
      return formatNumber(value, this.localeService.locale(), digitsInfo);
    } catch {
      return String(value);
    }
  }
}
