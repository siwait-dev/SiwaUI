import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LoginFeedback } from './login.models';

export const LoginActions = createActionGroup({
  source: 'Login',
  events: {
    Submit: props<{ email: string; password: string }>(),
    'Submit Success': props<{ mustChangePassword: boolean }>(),
    'Submit Failure': props<{ errorKey: string }>(),
    'Set Feedback': props<{ feedback: LoginFeedback }>(),
    'Consume Feedback': emptyProps(),
  },
});
