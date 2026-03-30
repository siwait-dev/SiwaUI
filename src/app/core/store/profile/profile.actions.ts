import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ProfileData, ProfileFeedback } from './profile.models';

export const ProfileActions = createActionGroup({
  source: 'Profile',
  events: {
    'Enter Page': emptyProps(),
    'Load Profile': emptyProps(),
    'Load Profile Success': props<{ profile: ProfileData }>(),
    'Load Profile Failure': emptyProps(),
    'Update Draft': props<{ patch: Partial<ProfileData> }>(),
    'Save Profile': emptyProps(),
    'Save Profile Success': props<{ profile: ProfileData }>(),
    'Save Profile Failure': emptyProps(),
    'Set Feedback': props<{ feedback: ProfileFeedback }>(),
    'Consume Feedback': emptyProps(),
  },
});
