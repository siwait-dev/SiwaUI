import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { Theme, Layout } from '../services/theme.service';

interface ThemeState {
  theme: Theme;
  layout: Layout;
}

const initialState: ThemeState = {
  theme: 'light',
  layout: 'sidebar',
};

export const ThemeStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(store => ({
    setTheme(theme: Theme) {
      patchState(store, { theme });
    },
    setLayout(layout: Layout) {
      patchState(store, { layout });
    },
  })),
);
