import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LoginActions } from './login.actions';
import { selectFeedback, selectLoading } from './login.selectors';

@Injectable({ providedIn: 'root' })
export class LoginFacade {
  private readonly store = inject(Store);

  readonly loading = this.store.selectSignal(selectLoading);
  readonly feedback = this.store.selectSignal(selectFeedback);

  submit(email: string, password: string): void {
    this.store.dispatch(LoginActions.submit({ email, password }));
  }

  consumeFeedback(): void {
    this.store.dispatch(LoginActions.consumeFeedback());
  }
}
