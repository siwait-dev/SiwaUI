import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ChangePasswordActions } from './change-password.actions';
import { selectFeedback, selectLoading, selectPolicyReady } from './change-password.selectors';

@Injectable({ providedIn: 'root' })
export class ChangePasswordFacade {
  private readonly store = inject(Store);

  readonly policyReady = this.store.selectSignal(selectPolicyReady);
  readonly loading = this.store.selectSignal(selectLoading);
  readonly feedback = this.store.selectSignal(selectFeedback);

  enterPage(): void {
    this.store.dispatch(ChangePasswordActions.enterPage());
  }

  submit(currentPassword: string, newPassword: string): void {
    this.store.dispatch(ChangePasswordActions.submit({ currentPassword, newPassword }));
  }

  consumeFeedback(): void {
    this.store.dispatch(ChangePasswordActions.consumeFeedback());
  }
}
