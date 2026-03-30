import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { RegisterFeedback } from './register.models';

export const RegisterActions = createActionGroup({
  source: 'Register',
  events: {
    'Enter Page': emptyProps(),
    'Load Policy': emptyProps(),
    'Load Policy Success': emptyProps(),
    'Load Policy Failure': emptyProps(),
    Submit: props<{
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }>(),
    'Submit Success': props<{ email: string }>(),
    'Submit Failure': props<{ errorKey: string }>(),
    'Set Feedback': props<{ feedback: RegisterFeedback }>(),
    'Consume Feedback': emptyProps(),
  },
});
