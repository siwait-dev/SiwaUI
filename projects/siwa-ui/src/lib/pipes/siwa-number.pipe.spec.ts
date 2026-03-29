import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { SiwaNumberPipe } from './siwa-number.pipe';
import { LocaleService } from '../services/locale.service';

describe('SiwaNumberPipe', () => {
  let pipe: SiwaNumberPipe;
  let localeService: LocaleService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [SiwaNumberPipe],
    });
    pipe = TestBed.inject(SiwaNumberPipe);
    localeService = TestBed.inject(LocaleService);
  });

  it('should return empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should format number with NL locale (comma as decimal)', () => {
    localeService.setLanguage('nl');
    expect(pipe.transform(1234.56, '1.2-2')).toBe('1.234,56');
  });

  it('should format number with EN locale (period as decimal)', () => {
    localeService.setLanguage('en');
    expect(pipe.transform(1234.56, '1.2-2')).toBe('1,234.56');
  });

  it('should respect digitsInfo for rounding', () => {
    localeService.setLanguage('nl');
    expect(pipe.transform(1234, '1.0-0')).toBe('1.234');
  });
});
