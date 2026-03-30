import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Layout, Theme } from '../../../../../projects/siwa-ui/src/lib/services/theme.service';
import { ThemeSettingsActions } from './theme-settings.actions';
import { selectLayout, selectLoading, selectTheme } from './theme-settings.selectors';

@Injectable({ providedIn: 'root' })
export class ThemeSettingsFacade {
  private readonly store = inject(Store);

  readonly theme = this.store.selectSignal(selectTheme);
  readonly layout = this.store.selectSignal(selectLayout);
  readonly loading = this.store.selectSignal(selectLoading);

  enterPage(): void {
    this.store.dispatch(ThemeSettingsActions.enterPage());
  }

  setTheme(theme: Theme): void {
    this.store.dispatch(ThemeSettingsActions.setTheme({ theme }));
  }

  setLayout(layout: Layout): void {
    this.store.dispatch(ThemeSettingsActions.setLayout({ layout }));
  }
}
