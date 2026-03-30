import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, forkJoin, map, mergeMap, of } from 'rxjs';
import { ApiErrorService } from '../../services/api-error.service';
import { ApiService } from '../../services/api.service';
import { TranslationsActions } from './translations.actions';
import { FlatTranslationsResponse } from './translations.models';

@Injectable()
export class TranslationsEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(ApiService);
  private readonly apiError = inject(ApiErrorService);

  readonly enterPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TranslationsActions.enterPage),
      map(() => TranslationsActions.loadFlatTranslations()),
    ),
  );

  readonly loadFlatTranslations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TranslationsActions.loadFlatTranslations),
      mergeMap(() =>
        forkJoin({
          nl: this.api.get<FlatTranslationsResponse>('translations/nl/flat'),
          en: this.api.get<FlatTranslationsResponse>('translations/en/flat'),
        }).pipe(
          map(({ nl, en }) => TranslationsActions.loadFlatTranslationsSuccess({ nl, en })),
          catchError(() => of(TranslationsActions.loadFlatTranslationsFailure())),
        ),
      ),
    ),
  );

  readonly saveTranslation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TranslationsActions.saveTranslation),
      mergeMap(({ draft }) =>
        forkJoin([
          this.api.post<unknown>('translations', {
            key: draft.key,
            languageCode: 'nl',
            value: draft.nl,
            module: draft.module || null,
          }),
          this.api.post<unknown>('translations', {
            key: draft.key,
            languageCode: 'en',
            value: draft.en,
            module: draft.module || null,
          }),
        ]).pipe(
          map(() =>
            TranslationsActions.saveTranslationSuccess({
              row: {
                key: draft.key,
                nl: draft.nl,
                en: draft.en,
              },
            }),
          ),
          catchError(error =>
            of(
              TranslationsActions.saveTranslationFailure({
                errorKey: this.apiError.getMessageKey(
                  error,
                  'ADMIN.TRANSLATIONS.ERRORS.SAVE_FAILED',
                ),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  readonly deleteTranslation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TranslationsActions.deleteTranslation),
      mergeMap(({ row }) =>
        forkJoin([
          this.api.delete<unknown>(`translations/nl/${encodeURIComponent(row.key)}`),
          this.api.delete<unknown>(`translations/en/${encodeURIComponent(row.key)}`),
        ]).pipe(
          map(() => TranslationsActions.deleteTranslationSuccess({ key: row.key })),
          catchError(error =>
            of(
              TranslationsActions.deleteTranslationFailure({
                errorKey: this.apiError.getMessageKey(
                  error,
                  'ADMIN.TRANSLATIONS.ERRORS.DELETE_FAILED',
                ),
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
