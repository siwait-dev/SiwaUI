import {
  ApplicationConfig,
  ENVIRONMENT_INITIALIZER,
  LOCALE_ID,
  inject,
  isDevMode,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import localeEnGb from '@angular/common/locales/en-GB';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideState } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader, TranslateHttpLoader } from '@ngx-translate/http-loader';
import { providePrimeNG } from 'primeng/config';
import { SiwaPreset } from './core/theme/siwa-preset';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from '../../projects/siwa-ui/src/lib/interceptors/error.interceptor';
import { LocaleService } from '../../projects/siwa-ui/src/lib/services/locale.service';
import { LoggingService } from '../../projects/siwa-ui/src/lib/services/logging.service';
import { ThemeService } from '../../projects/siwa-ui/src/lib/services/theme.service';
import { LocaleSettingsEffects } from './core/store/locale-settings/locale-settings.effects';
import { LocaleSettingsFacade } from './core/store/locale-settings/locale-settings.facade';
import { localeSettingsFeature } from './core/store/locale-settings/locale-settings.reducer';
import { AuthFacade } from './core/store/auth/auth.facade';
import { AuthEffects } from './core/store/auth/auth.effects';
import { authFeature } from './core/store/auth/auth.reducer';
import { environment } from '../environments/environment';

registerLocaleData(localeNl, 'nl-NL');
registerLocaleData(localeEnGb, 'en-GB');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
    ),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideAnimationsAsync(),
    provideStore(),
    provideState(authFeature),
    provideState(localeSettingsFeature),
    provideEffects(AuthEffects),
    provideEffects(LocaleSettingsEffects),
    ...(isDevMode()
      ? [
          provideStoreDevtools({
            maxAge: 25,
            logOnly: false,
            autoPause: true,
            trace: true,
            connectInZone: true,
          }),
        ]
      : []),
    provideTranslateService({
      fallbackLang: 'nl',
      lang: 'nl',
      loader: provideTranslateLoader(TranslateHttpLoader),
    }),
    ...provideTranslateHttpLoader({ prefix: '/assets/i18n/', suffix: '.json' }),
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => {
        inject(ThemeService).init();
        inject(LocaleSettingsFacade).bootstrap();
        inject(AuthFacade).bootstrapSession();
        inject(LoggingService).configure(`${environment.apiUrl}/logs/client`);
      },
    },
    providePrimeNG({
      theme: {
        preset: SiwaPreset,
        options: {
          darkModeSelector: 'html.dark',
          cssLayer: {
            name: 'primeng',
            order: 'tailwind-base, primeng, tailwind-utilities',
          },
        },
      },
      ripple: true,
    }),
    {
      provide: LOCALE_ID,
      useFactory: () => {
        const lang = localStorage.getItem('siwa-language') ?? inject(LocaleService).language();
        return lang === 'en' ? 'en-GB' : 'nl-NL';
      },
    },
  ],
};
