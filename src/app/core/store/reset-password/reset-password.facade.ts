import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ResetPasswordActions } from './reset-password.actions';
import {
  selectEmail,
  selectFeedback,
  selectLoading,
  selectPolicyReady,
  selectToken,
} from './reset-password.selectors';

@Injectable({ providedIn: 'root' })
export class ResetPasswordFacade {
  private readonly store = inject(Store);

  readonly email = this.store.selectSignal(selectEmail);
  readonly token = this.store.selectSignal(selectToken);
  readonly policyReady = this.store.selectSignal(selectPolicyReady);
  readonly loading = this.store.selectSignal(selectLoading);
  readonly feedback = this.store.selectSignal(selectFeedback);

  enterPage(): void {
    this.store.dispatch(ResetPasswordActions.enterPage());
  }

  setRequestContext(email: string, token: string): void {
    this.store.dispatch(ResetPasswordActions.setRequestContext({ email, token }));
  }

  submit(email: string, token: string, newPassword: string): void {
    this.store.dispatch(ResetPasswordActions.submit({ email, token, newPassword }));
  }

  consumeFeedback(): void {
    this.store.dispatch(ResetPasswordActions.consumeFeedback());
  }
}
