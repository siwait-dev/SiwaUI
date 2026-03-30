import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppSettingsActions } from './app-settings.actions';
import { AppConfigDto } from './app-settings.models';
import {
  selectConfig,
  selectFeedback,
  selectLoading,
  selectSaving,
} from './app-settings.selectors';

@Injectable({ providedIn: 'root' })
export class AppSettingsFacade {
  private readonly store = inject(Store);

  readonly config = this.store.selectSignal(selectConfig);
  readonly loading = this.store.selectSignal(selectLoading);
  readonly saving = this.store.selectSignal(selectSaving);
  readonly feedback = this.store.selectSignal(selectFeedback);

  enterPage(): void {
    this.store.dispatch(AppSettingsActions.enterPage());
  }

  updateDraft(patch: Partial<AppConfigDto>): void {
    this.store.dispatch(AppSettingsActions.updateDraft({ patch }));
  }

  save(): void {
    this.store.dispatch(AppSettingsActions.saveSettings());
  }

  consumeFeedback(): void {
    this.store.dispatch(AppSettingsActions.consumeFeedback());
  }
}
