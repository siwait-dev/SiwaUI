import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { SiwaCurrencyPipe } from './siwa-currency.pipe';
import { LocaleService } from '../services/locale.service';

describe('SiwaCurrencyPipe', () => {
  let pipe: SiwaCurrencyPipe;
  let localeService: LocaleService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [SiwaCurrencyPipe],
    });
    pipe = TestBed.inject(SiwaCurrencyPipe);
    localeService = TestBed.inject(LocaleService);
  });

  it('should return empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should format currency with NL locale', () => {
    localeService.setLanguage('nl');
    const result = pipe.transform(1234.56);
    // NL: € 1.234,56
    expect(result).toContain('1.234,56');
    expect(result).toContain('€');
  });

  it('should format currency with EN locale', () => {
    localeService.setLanguage('en');
    const result = pipe.transform(1234.56);
    // EN: €1,234.56
    expect(result).toContain('1,234.56');
    expect(result).toContain('€');
  });

  it('should support custom currency code', () => {
    localeService.setLanguage('en');
    const result = pipe.transform(100, 'USD', 'code');
    expect(result).toContain('USD');
    expect(result).toContain('100');
  });
});
