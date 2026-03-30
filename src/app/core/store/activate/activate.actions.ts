import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const ActivateActions = createActionGroup({
  source: 'Activate',
  events: {
    'Set No Params': emptyProps(),
    Submit: props<{ email: string; token: string }>(),
    'Submit Success': emptyProps(),
    'Submit Failure': emptyProps(),
  },
});
