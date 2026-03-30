import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { AppSettingsActions } from './app-settings.actions';
import { AppConfigDto } from './app-settings.models';
import { selectConfig } from './app-settings.selectors';

@Injectable()
export class AppSettingsEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly api = inject(ApiService);

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
        this.api.get<AppConfigDto>('settings').pipe(
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
        this.api.put<AppConfigDto>('settings', config).pipe(
          map(saved => AppSettingsActions.saveSettingsSuccess({ config: saved })),
          catchError(() => of(AppSettingsActions.saveSettingsFailure())),
        ),
      ),
    ),
  );
}
