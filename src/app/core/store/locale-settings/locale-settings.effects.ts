import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs';
import { LocaleService } from '../../../../../projects/siwa-ui/src/lib/services/locale.service';
import { LocaleSettingsActions } from './locale-settings.actions';

@Injectable()
export class LocaleSettingsEffects {
  private readonly actions$ = inject(Actions);
  private readonly localeService = inject(LocaleService);

  readonly bootstrap$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocaleSettingsActions.bootstrap),
      tap(() => this.localeService.init()),
      map(() =>
        LocaleSettingsActions.bootstrapSuccess({
          language: this.localeService.language(),
          config: this.localeService.config(),
        }),
      ),
    ),
  );

  readonly setLanguage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocaleSettingsActions.setLanguage),
      tap(({ language }) => this.localeService.setLanguage(language)),
      map(({ language }) =>
        LocaleSettingsActions.setLanguageSuccess({
          language,
          config: this.localeService.config(),
        }),
      ),
    ),
  );
}
