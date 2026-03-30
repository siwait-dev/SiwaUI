import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import {
  ThemeService,
  type Layout,
  type Theme,
} from '../../../../../projects/siwa-ui/src/lib/services/theme.service';
import { ThemeSettingsEffects } from '../../../core/store/theme-settings/theme-settings.effects';
import { themeSettingsFeature } from '../../../core/store/theme-settings/theme-settings.reducer';
import { ThemeSettingsComponent } from './theme-settings.component';

describe('ThemeSettingsComponent', () => {
  let themeValue = signal<Theme>('light');
  let layoutValue = signal<Layout>('sidebar');

  const themeService = {
    theme: () => themeValue(),
    layout: () => layoutValue(),
    setTheme: vi.fn((theme: Theme) => themeValue.set(theme)),
    setLayout: vi.fn((layout: Layout) => layoutValue.set(layout)),
  };

  beforeEach(async () => {
    themeValue = signal<Theme>('light');
    layoutValue = signal<Layout>('sidebar');
    themeService.setTheme.mockClear();
    themeService.setLayout.mockClear();

    await TestBed.configureTestingModule({
      imports: [ThemeSettingsComponent, TranslateModule.forRoot()],
      providers: [
        provideStore(),
        provideState(themeSettingsFeature),
        provideEffects(ThemeSettingsEffects),
        { provide: ThemeService, useValue: themeService },
      ],
    }).compileComponents();
  });

  it('loads current theme preferences on init', async () => {
    const fixture = TestBed.createComponent(ThemeSettingsComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance['selectedTheme']()).toBe('light');
    expect(fixture.componentInstance['selectedLayout']()).toBe('sidebar');
  });

  it('updates the selected theme through the facade flow', async () => {
    const fixture = TestBed.createComponent(ThemeSettingsComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.componentInstance.setTheme('dark');
    await fixture.whenStable();

    expect(themeService.setTheme).toHaveBeenCalledWith('dark');
    expect(fixture.componentInstance['selectedTheme']()).toBe('dark');
  });

  it('updates the selected layout through the facade flow', async () => {
    const fixture = TestBed.createComponent(ThemeSettingsComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.componentInstance.setLayout('topbar');
    await fixture.whenStable();

    expect(themeService.setLayout).toHaveBeenCalledWith('topbar');
    expect(fixture.componentInstance['selectedLayout']()).toBe('topbar');
  });
});
