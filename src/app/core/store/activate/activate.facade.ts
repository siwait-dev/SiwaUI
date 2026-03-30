import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivateActions } from './activate.actions';
import { selectStatus } from './activate.selectors';

@Injectable({ providedIn: 'root' })
export class ActivateFacade {
  private readonly store = inject(Store);

  readonly status = this.store.selectSignal(selectStatus);

  setNoParams(): void {
    this.store.dispatch(ActivateActions.setNoParams());
  }

  submit(email: string, token: string): void {
    this.store.dispatch(ActivateActions.submit({ email, token }));
  }
}
