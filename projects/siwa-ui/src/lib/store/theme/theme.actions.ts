import { createActionGroup, props } from '@ngrx/store';
import { Layout, Theme } from '../../services/theme.service';

export const themeStoreActions = createActionGroup({
  source: 'Library Theme Store',
  events: {
    'Set Theme': props<{ theme: Theme }>(),
    'Set Layout': props<{ layout: Layout }>(),
  },
});
