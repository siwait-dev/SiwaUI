import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { UserInfo } from '../../auth/auth.service';

export const authStoreActions = createActionGroup({
  source: 'Library Auth Store',
  events: {
    'Set Loading': props<{ isLoading: boolean }>(),
    'Set User': props<{ user: UserInfo }>(),
    'Set Error': props<{ error: string }>(),
    Logout: emptyProps(),
  },
});
