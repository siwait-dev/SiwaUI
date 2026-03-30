import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslationsActions } from './translations.actions';
import { TranslationDraft, TranslationRow } from './translations.models';
import {
  selectEditError,
  selectFeedback,
  selectLoading,
  selectRows,
  selectSaving,
} from './translations.selectors';

@Injectable({ providedIn: 'root' })
export class TranslationsFacade {
  private readonly store = inject(Store);

  readonly rows = this.store.selectSignal(selectRows);
  readonly loading = this.store.selectSignal(selectLoading);
  readonly saving = this.store.selectSignal(selectSaving);
  readonly editError = this.store.selectSignal(selectEditError);
  readonly feedback = this.store.selectSignal(selectFeedback);

  enterPage(): void {
    this.store.dispatch(TranslationsActions.enterPage());
  }

  saveTranslation(draft: TranslationDraft): void {
    this.store.dispatch(TranslationsActions.saveTranslation({ draft }));
  }

  deleteTranslation(row: TranslationRow): void {
    this.store.dispatch(TranslationsActions.deleteTranslation({ row }));
  }

  clearEditError(): void {
    this.store.dispatch(TranslationsActions.clearEditError());
  }

  consumeFeedback(): void {
    this.store.dispatch(TranslationsActions.consumeFeedback());
  }
}
