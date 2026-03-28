import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-layout');

    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should default to light theme', () => {
    expect(service.theme()).toBe('light');
  });

  it('should default to sidebar layout', () => {
    expect(service.layout()).toBe('sidebar');
  });

  it('should set dark theme and add class to html element', () => {
    service.setTheme('dark');
    expect(service.theme()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });

  it('should persist theme in localStorage', () => {
    service.setTheme('dark');
    expect(localStorage.getItem('siwa-theme')).toBe('dark');
  });

  it('should set topbar layout and update data attribute', () => {
    service.setLayout('topbar');
    expect(service.layout()).toBe('topbar');
    expect(document.documentElement.getAttribute('data-layout')).toBe('topbar');
  });

  it('should persist layout in localStorage', () => {
    service.setLayout('topbar');
    expect(localStorage.getItem('siwa-layout')).toBe('topbar');
  });

  it('should restore theme from localStorage on init', () => {
    localStorage.setItem('siwa-theme', 'dark');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const freshService = TestBed.inject(ThemeService);
    expect(freshService.theme()).toBe('dark');
  });

  it('should apply both theme and layout on init()', () => {
    service.setTheme('dark');
    service.setLayout('topbar');
    service.init();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.getAttribute('data-layout')).toBe('topbar');
  });
});
