import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RegisterActions } from './register.actions';
import { selectFeedback, selectLoading, selectPolicyReady } from './register.selectors';

@Injectable({ providedIn: 'root' })
export class RegisterFacade {
  private readonly store = inject(Store);

  readonly policyReady = this.store.selectSignal(selectPolicyReady);
  readonly loading = this.store.selectSignal(selectLoading);
  readonly feedback = this.store.selectSignal(selectFeedback);

  enterPage(): void {
    this.store.dispatch(RegisterActions.enterPage());
  }

  submit(firstName: string, lastName: string, email: string, password: string): void {
    this.store.dispatch(RegisterActions.submit({ firstName, lastName, email, password }));
  }

  consumeFeedback(): void {
    this.store.dispatch(RegisterActions.consumeFeedback());
  }
}
