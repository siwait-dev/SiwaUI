import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import {
  ThemeService,
  Theme,
  Layout,
} from '../../../../../projects/siwa-ui/src/lib/services/theme.service';

@Component({
  selector: 'app-theme-settings',
  imports: [TranslateModule, CardModule, ButtonModule],
  template: `
    <div class="flex flex-col gap-6 max-w-lg">
      <h1 class="text-2xl font-bold">{{ 'THEME_SETTINGS.TITLE' | translate }}</h1>

      <!-- Kleurthema -->
      <p-card [header]="'THEME_SETTINGS.COLOR_THEME' | translate">
        <div class="flex gap-2">
          @for (opt of themeOptions; track opt.value) {
            <p-button
              [label]="opt.labelKey | translate"
              [icon]="opt.icon"
              [severity]="themeService.theme() === opt.value ? 'primary' : 'secondary'"
              [outlined]="themeService.theme() !== opt.value"
              (onClick)="setTheme(opt.value)"
              [attr.aria-pressed]="themeService.theme() === opt.value"
            />
          }
        </div>
      </p-card>

      <!-- Weergavestijl -->
      <p-card [header]="'THEME_SETTINGS.LAYOUT_STYLE' | translate">
        <div class="flex gap-2">
          @for (opt of layoutOptions; track opt.value) {
            <p-button
              [label]="opt.labelKey | translate"
              [icon]="opt.icon"
              [severity]="themeService.layout() === opt.value ? 'primary' : 'secondary'"
              [outlined]="themeService.layout() !== opt.value"
              (onClick)="setLayout(opt.value)"
              [attr.aria-pressed]="themeService.layout() === opt.value"
            />
          }
        </div>
        <p class="text-surface-500 text-sm mt-3">
          @if (themeService.layout() === 'topbar') {
            {{ 'THEME_SETTINGS.TOPBAR_HINT' | translate }}
          } @else {
            {{ 'THEME_SETTINGS.SIDEBAR_HINT' | translate }}
          }
        </p>
      </p-card>
    </div>
  `,
})
export class ThemeSettingsComponent {
  protected readonly themeService = inject(ThemeService);

  readonly themeOptions: { value: Theme; labelKey: string; icon: string }[] = [
    { value: 'light', labelKey: 'THEME_SETTINGS.LIGHT', icon: 'pi pi-sun' },
    { value: 'dark', labelKey: 'THEME_SETTINGS.DARK', icon: 'pi pi-moon' },
  ];

  readonly layoutOptions: { value: Layout; labelKey: string; icon: string }[] = [
    { value: 'sidebar', labelKey: 'THEME_SETTINGS.SIDEBAR', icon: 'pi pi-align-left' },
    { value: 'topbar', labelKey: 'THEME_SETTINGS.TOPBAR', icon: 'pi pi-align-justify' },
  ];

  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }

  setLayout(layout: Layout): void {
    this.themeService.setLayout(layout);
  }
}
