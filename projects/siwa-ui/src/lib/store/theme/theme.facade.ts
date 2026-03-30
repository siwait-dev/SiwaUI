import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Layout, Theme } from '../../services/theme.service';
import { themeStoreActions } from './theme.actions';
import { selectLayoutValue, selectThemeValue } from './theme.selectors';

@Injectable({ providedIn: 'root' })
export class ThemeStoreFacade {
  private readonly store = inject(Store);

  readonly theme = this.store.selectSignal(selectThemeValue);
  readonly layout = this.store.selectSignal(selectLayoutValue);

  setTheme(theme: Theme): void {
    this.store.dispatch(themeStoreActions.setTheme({ theme }));
  }

  setLayout(layout: Layout): void {
    this.store.dispatch(themeStoreActions.setLayout({ layout }));
  }
}
