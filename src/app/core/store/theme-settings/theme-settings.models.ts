import { Layout, Theme } from '../../../../../projects/siwa-ui/src/lib/services/theme.service';

export interface ThemeSettingsStateModel {
  theme: Theme;
  layout: Layout;
  loading: boolean;
}
