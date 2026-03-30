import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ForgotPasswordActions } from './forgot-password.actions';
import { selectFeedback, selectLoading } from './forgot-password.selectors';

@Injectable({ providedIn: 'root' })
export class ForgotPasswordFacade {
  private readonly store = inject(Store);

  readonly loading = this.store.selectSignal(selectLoading);
  readonly feedback = this.store.selectSignal(selectFeedback);

  submit(email: string): void {
    this.store.dispatch(ForgotPasswordActions.submit({ email }));
  }

  consumeFeedback(): void {
    this.store.dispatch(ForgotPasswordActions.consumeFeedback());
  }
}
