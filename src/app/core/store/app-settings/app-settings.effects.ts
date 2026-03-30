import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { AppSettingsApiService } from '../../services/app-settings-api.service';
import { AppSettingsActions } from './app-settings.actions';
import { AppConfigDto } from './app-settings.models';
import { selectConfig } from './app-settings.selectors';

@Injectable()
export class AppSettingsEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly appSettingsApi = inject(AppSettingsApiService);

  readonly enterPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppSettingsActions.enterPage),
      map(() => AppSettingsActions.loadSettings()),
    ),
  );

  readonly loadSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppSettingsActions.loadSettings),
      mergeMap(() =>
        this.appSettingsApi.getSettings<AppConfigDto>().pipe(
          map(config => AppSettingsActions.loadSettingsSuccess({ config })),
          catchError(() => of(AppSettingsActions.loadSettingsFailure())),
        ),
      ),
    ),
  );

  readonly saveSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppSettingsActions.saveSettings),
      withLatestFrom(this.store.select(selectConfig)),
      mergeMap(([, config]) =>
        this.appSettingsApi.updateSettings(config).pipe(
          map(saved => AppSettingsActions.saveSettingsSuccess({ config: saved })),
          catchError(() => of(AppSettingsActions.saveSettingsFailure())),
        ),
      ),
    ),
  );
}
