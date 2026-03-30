import { Layout, Theme } from '../../services/theme.service';

export interface ThemeState {
  theme: Theme;
  layout: Layout;
}

export const initialThemeState: ThemeState = {
  theme: 'light',
  layout: 'sidebar',
};
