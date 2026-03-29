import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ThemeService } from '../../../../../projects/siwa-ui/src/lib/services/theme.service';
import {
  LocaleService,
  Language,
} from '../../../../../projects/siwa-ui/src/lib/services/locale.service';
import { NAV_GROUPS } from '../../../core/navigation/nav-config';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  imports: [RouterLink, RouterLinkActive, TranslateModule, ButtonModule, MenuModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly localeService = inject(LocaleService);
  private readonly translate = inject(TranslateService);
  private readonly authService = inject(AuthService);

  // ── Topbar-navigatie (layout = topbar) ──────────────────────────────────────

  /** Applicatie-items: tonen als directe links in de topbar. */
  protected readonly appNavItems = NAV_GROUPS[0].items;

  /**
   * Beheer-items: tonen als popup-menu in de topbar.
   * Recomputed bij elke taalwissel zodat labels actueel blijven.
   */
  protected readonly adminMenuItems = computed<MenuItem[]>(() => {
    this.localeService.language(); // reactieve afhankelijkheid
    return NAV_GROUPS[1].items.map(item => ({
      label: this.translate.instant(item.labelKey),
      icon: item.icon,
      routerLink: item.route,
    }));
  });

  // ── Gebruikersmenu (reactief vertaald) ──────────────────────────────────────
  readonly userMenuItems = computed<MenuItem[]>(() => {
    this.localeService.language(); // reactieve afhankelijkheid
    return [
      {
        label: this.translate.instant('NAV.PROFILE'),
        icon: 'pi pi-user',
        routerLink: '/app/profile',
      },
      { separator: true },
      {
        label: this.translate.instant('NAV.SIGN_OUT'),
        icon: 'pi pi-sign-out',
        command: () => this.authService.logout(),
      },
    ];
  });

  // ── Taalwisselaar ───────────────────────────────────────────────────────────
  readonly languages: { code: Language; labelKey: string; flag: string }[] = [
    { code: 'nl', labelKey: 'TOPBAR.LANG_NL', flag: '🇳🇱' },
    { code: 'en', labelKey: 'TOPBAR.LANG_EN', flag: '🇬🇧' },
  ];

  toggleTheme(): void {
    this.themeService.setTheme(this.themeService.theme() === 'dark' ? 'light' : 'dark');
  }

  setLanguage(lang: Language): void {
    this.localeService.setLanguage(lang);
  }
}
