import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ChangePasswordFeedback } from './change-password.models';

export const ChangePasswordActions = createActionGroup({
  source: 'Change Password',
  events: {
    'Enter Page': emptyProps(),
    'Load Policy': emptyProps(),
    'Load Policy Success': emptyProps(),
    'Load Policy Failure': emptyProps(),
    Submit: props<{ currentPassword: string; newPassword: string }>(),
    'Submit Success': emptyProps(),
    'Submit Failure': props<{ errorKey: string }>(),
    'Set Feedback': props<{ feedback: ChangePasswordFeedback }>(),
    'Consume Feedback': emptyProps(),
  },
});
