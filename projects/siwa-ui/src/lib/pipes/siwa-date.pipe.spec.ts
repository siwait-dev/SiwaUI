import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { SiwaDatePipe } from './siwa-date.pipe';
import { LocaleService } from '../services/locale.service';

describe('SiwaDatePipe', () => {
  let pipe: SiwaDatePipe;
  let localeService: LocaleService;

  // Fixed test date: 5 March 2025
  const testDate = new Date(2025, 2, 5, 14, 30, 0);

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [SiwaDatePipe],
    });
    pipe = TestBed.inject(SiwaDatePipe);
    localeService = TestBed.inject(LocaleService);
  });

  it('should return empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should format date in NL format (dd-MM-yyyy)', () => {
    localeService.setLanguage('nl');
    expect(pipe.transform(testDate)).toBe('05-03-2025');
  });

  it('should format date in EN format (dd/MM/yyyy)', () => {
    localeService.setLanguage('en');
    expect(pipe.transform(testDate)).toBe('05/03/2025');
  });

  it('should format dateTime in NL format', () => {
    localeService.setLanguage('nl');
    expect(pipe.transform(testDate, 'dateTime')).toBe('05-03-2025 14:30');
  });

  it('should format dateTime in EN format', () => {
    localeService.setLanguage('en');
    expect(pipe.transform(testDate, 'dateTime')).toBe('05/03/2025 14:30');
  });

  it('should support custom Angular format string', () => {
    localeService.setLanguage('nl');
    const result = pipe.transform(testDate, 'yyyy');
    expect(result).toBe('2025');
  });
});
