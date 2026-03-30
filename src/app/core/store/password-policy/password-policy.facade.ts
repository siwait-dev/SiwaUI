import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { PasswordPolicy } from '../../services/password-policy.service';
import { PasswordPolicyActions } from './password-policy.actions';
import {
  selectFeedback,
  selectLoading,
  selectPolicy,
  selectSaving,
} from './password-policy.selectors';

@Injectable({ providedIn: 'root' })
export class PasswordPolicyFacade {
  private readonly store = inject(Store);

  readonly policy = this.store.selectSignal(selectPolicy);
  readonly loading = this.store.selectSignal(selectLoading);
  readonly saving = this.store.selectSignal(selectSaving);
  readonly feedback = this.store.selectSignal(selectFeedback);

  enterPage(): void {
    this.store.dispatch(PasswordPolicyActions.enterPage());
  }

  updateDraft(patch: Partial<PasswordPolicy>): void {
    this.store.dispatch(PasswordPolicyActions.updateDraft({ patch }));
  }

  save(): void {
    this.store.dispatch(PasswordPolicyActions.savePolicy());
  }

  consumeFeedback(): void {
    this.store.dispatch(PasswordPolicyActions.consumeFeedback());
  }
}
