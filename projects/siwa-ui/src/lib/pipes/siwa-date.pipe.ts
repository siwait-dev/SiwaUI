import { inject, Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';
import { LocaleService } from '../services/locale.service';

/**
 * SiwaDatePipe — locale-aware date formatting.
 *
 * Uses the active locale from LocaleService so it reacts to language switches.
 *
 * @example
 * {{ order.createdAt | siwaDate }}              // uses default format: dd-MM-yyyy
 * {{ order.createdAt | siwaDate:'dateTime' }}   // dd-MM-yyyy HH:mm
 * {{ order.createdAt | siwaDate:'dd MMMM yyyy' }} // custom Angular format string
 */
@Pipe({ name: 'siwaDate', pure: false })
export class SiwaDatePipe implements PipeTransform {
  private readonly localeService = inject(LocaleService);

  transform(
    value: Date | string | number | null | undefined,
    format?: 'date' | 'dateTime' | string,
  ): string {
    if (value == null || value === '') return '';

    const locale = this.localeService.locale();
    const fmt = this.resolveFormat(format);

    try {
      return formatDate(value, fmt, locale);
    } catch {
      return String(value);
    }
  }

  private resolveFormat(format: string | undefined): string {
    switch (format) {
      case 'dateTime':
        return this.localeService.dateTimeFormat();
      case 'date':
      case undefined:
        return this.localeService.dateFormat();
      default:
        return format;
    }
  }
}
