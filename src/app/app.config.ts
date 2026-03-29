import {
  ApplicationConfig,
  ENVIRONMENT_INITIALIZER,
  LOCALE_ID,
  inject,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import localeEnGb from '@angular/common/locales/en-GB';
import { provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader, TranslateHttpLoader } from '@ngx-translate/http-loader';
import { providePrimeNG } from 'primeng/config';
import { SiwaPreset } from './core/theme/siwa-preset';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from '../../projects/siwa-ui/src/lib/interceptors/error.interceptor';
import { LoggingService } from '../../projects/siwa-ui/src/lib/services/logging.service';
import { environment } from '../environments/environment';

// Register locale data for NL and EN-GB at startup
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

    // ngx-translate v17 standalone API
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
        inject(LoggingService).configure(`${environment.apiUrl}/logs/client`);
      },
    },

    // PrimeNG with Aura theme
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

    // LOCALE_ID for Angular built-in pipes — reads persisted value from localStorage
    {
      provide: LOCALE_ID,
      useFactory: () => {
        const lang = localStorage.getItem('siwa-language') ?? 'nl';
        return lang === 'en' ? 'en-GB' : 'nl-NL';
      },
    },
  ],
};
