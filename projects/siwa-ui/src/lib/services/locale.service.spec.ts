import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocaleService } from './locale.service';

describe('LocaleService', () => {
  let service: LocaleService;
  let translateService: TranslateService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
    });

    service = TestBed.inject(LocaleService);
    translateService = TestBed.inject(TranslateService);
    vi.spyOn(translateService, 'use');
  });

  it('should default to NL when no language stored', () => {
    expect(service.language()).toBe('nl');
  });

  it('should load persisted language from localStorage', () => {
    localStorage.setItem('siwa-language', 'en');
    // Re-create service to pick up localStorage value
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [TranslateModule.forRoot()] });
    const fresh = TestBed.inject(LocaleService);
    expect(fresh.language()).toBe('en');
  });

  it('should return nl-NL locale config for NL', () => {
    service.setLanguage('nl');
    expect(service.locale()).toBe('nl-NL');
    expect(service.dateFormat()).toBe('dd-MM-yyyy');
    expect(service.currencyCode()).toBe('EUR');
  });

  it('should return en-GB locale config for EN', () => {
    service.setLanguage('en');
    expect(service.locale()).toBe('en-GB');
    expect(service.dateFormat()).toBe('dd/MM/yyyy');
    expect(service.dateTimeFormat()).toBe('dd/MM/yyyy HH:mm');
  });

  it('should persist language to localStorage on setLanguage', () => {
    service.setLanguage('en');
    expect(localStorage.getItem('siwa-language')).toBe('en');
  });

  it('should call translate.use on setLanguage', () => {
    service.init();
    service.setLanguage('en');
    expect(translateService.use).toHaveBeenCalledWith('en');
  });

  it('should update language signal on setLanguage', () => {
    service.setLanguage('en');
    expect(service.language()).toBe('en');
    service.setLanguage('nl');
    expect(service.language()).toBe('nl');
  });
});
