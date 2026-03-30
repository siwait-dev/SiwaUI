import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Bootstrap Session': emptyProps(),
    'Set Session': props<{ accessToken: string; refreshToken: string }>(),
    'Clear Session': props<{ redirect: boolean }>(),
  },
});
