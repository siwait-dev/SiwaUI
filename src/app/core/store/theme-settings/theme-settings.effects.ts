import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs';
import { ThemeService } from '../../../../../projects/siwa-ui/src/lib/services/theme.service';
import { ThemeSettingsActions } from './theme-settings.actions';

@Injectable()
export class ThemeSettingsEffects {
  private readonly actions$ = inject(Actions);
  private readonly themeService = inject(ThemeService);

  readonly enterPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ThemeSettingsActions.enterPage),
      map(() => ThemeSettingsActions.loadPreferences()),
    ),
  );

  readonly loadPreferences$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ThemeSettingsActions.loadPreferences),
      map(() =>
        ThemeSettingsActions.loadPreferencesSuccess({
          theme: this.themeService.theme(),
          layout: this.themeService.layout(),
        }),
      ),
    ),
  );

  readonly setTheme$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ThemeSettingsActions.setTheme),
        tap(({ theme }) => this.themeService.setTheme(theme)),
      ),
    { dispatch: false },
  );

  readonly setLayout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ThemeSettingsActions.setLayout),
        tap(({ layout }) => this.themeService.setLayout(layout)),
      ),
    { dispatch: false },
  );
}
