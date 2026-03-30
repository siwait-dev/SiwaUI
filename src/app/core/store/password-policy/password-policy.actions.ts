import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { PasswordPolicyFeedback, PasswordPolicyModel } from './password-policy.models';

export const PasswordPolicyActions = createActionGroup({
  source: 'Password Policy',
  events: {
    'Enter Page': emptyProps(),
    'Load Policy': emptyProps(),
    'Load Policy Success': props<{ policy: PasswordPolicyModel }>(),
    'Load Policy Failure': emptyProps(),
    'Update Draft': props<{ patch: Partial<PasswordPolicyModel> }>(),
    'Save Policy': emptyProps(),
    'Save Policy Success': props<{ policy: PasswordPolicyModel }>(),
    'Save Policy Failure': emptyProps(),
    'Set Feedback': props<{ feedback: PasswordPolicyFeedback }>(),
    'Consume Feedback': emptyProps(),
  },
});
