import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ApiErrorService } from '../../services/api-error.service';
import { TranslationsApiService } from '../../services/translations-api.service';
import { TranslationsActions } from './translations.actions';
import { FlatTranslationsResponse } from './translations.models';

@Injectable()
export class TranslationsEffects {
  private readonly actions$ = inject(Actions);
  private readonly translationsApi = inject(TranslationsApiService);
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
        this.translationsApi.getFlatTranslations<FlatTranslationsResponse>().pipe(
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
        this.translationsApi.saveTranslation(draft.key, draft.module, draft.nl, draft.en).pipe(
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
        this.translationsApi.deleteTranslation(row.key).pipe(
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
