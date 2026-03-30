import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ForgotPasswordFeedback } from './forgot-password.models';

export const ForgotPasswordActions = createActionGroup({
  source: 'Forgot Password',
  events: {
    Submit: props<{ email: string }>(),
    'Submit Success': emptyProps(),
    'Submit Failure': props<{ errorKey: string }>(),
    'Set Feedback': props<{ feedback: ForgotPasswordFeedback }>(),
    'Consume Feedback': emptyProps(),
  },
});
