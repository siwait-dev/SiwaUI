import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ResetPasswordFeedback } from './reset-password.models';

export const ResetPasswordActions = createActionGroup({
  source: 'Reset Password',
  events: {
    'Enter Page': emptyProps(),
    'Load Policy': emptyProps(),
    'Load Policy Success': emptyProps(),
    'Load Policy Failure': emptyProps(),
    'Set Request Context': props<{ email: string; token: string }>(),
    Submit: props<{ email: string; token: string; newPassword: string }>(),
    'Submit Success': emptyProps(),
    'Submit Failure': props<{ errorKey: string }>(),
    'Set Feedback': props<{ feedback: ResetPasswordFeedback }>(),
    'Consume Feedback': emptyProps(),
  },
});
