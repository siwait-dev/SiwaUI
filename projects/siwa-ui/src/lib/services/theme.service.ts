import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';
export type Layout = 'sidebar' | 'topbar';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_KEY = 'siwa-theme';
  private readonly LAYOUT_KEY = 'siwa-layout';

  readonly theme = signal<Theme>(this.loadTheme());
  readonly layout = signal<Layout>(this.loadLayout());

  setTheme(theme: Theme): void {
    this.theme.set(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }

  setLayout(layout: Layout): void {
    this.layout.set(layout);
    localStorage.setItem(this.LAYOUT_KEY, layout);
    document.documentElement.setAttribute('data-layout', layout);
  }

  init(): void {
    this.setTheme(this.theme());
    this.setLayout(this.layout());
  }

  private loadTheme(): Theme {
    return (localStorage.getItem(this.THEME_KEY) as Theme) ?? 'light';
  }

  private loadLayout(): Layout {
    return (localStorage.getItem(this.LAYOUT_KEY) as Layout) ?? 'sidebar';
  }
}
