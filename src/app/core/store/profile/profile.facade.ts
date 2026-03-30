import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProfileActions } from './profile.actions';
import { ProfileData } from './profile.models';
import { selectFeedback, selectLoading, selectProfile, selectSaving } from './profile.selectors';

@Injectable({ providedIn: 'root' })
export class ProfileFacade {
  private readonly store = inject(Store);

  readonly profile = this.store.selectSignal(selectProfile);
  readonly loading = this.store.selectSignal(selectLoading);
  readonly saving = this.store.selectSignal(selectSaving);
  readonly feedback = this.store.selectSignal(selectFeedback);

  enterPage(): void {
    this.store.dispatch(ProfileActions.enterPage());
  }

  updateDraft(patch: Partial<ProfileData>): void {
    this.store.dispatch(ProfileActions.updateDraft({ patch }));
  }

  save(): void {
    this.store.dispatch(ProfileActions.saveProfile());
  }

  consumeFeedback(): void {
    this.store.dispatch(ProfileActions.consumeFeedback());
  }
}
