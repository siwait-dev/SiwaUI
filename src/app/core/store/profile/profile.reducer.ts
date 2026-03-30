import { createFeature, createReducer, on } from '@ngrx/store';
import { ProfileActions } from './profile.actions';
import { ProfileData, ProfileFeedback } from './profile.models';

export interface ProfileState {
  profile: ProfileData;
  loading: boolean;
  saving: boolean;
  feedback: ProfileFeedback | null;
}

const defaultProfile: ProfileData = {
  userId: '',
  email: '',
  firstName: '',
  lastName: '',
  roles: [],
};

const initialState: ProfileState = {
  profile: defaultProfile,
  loading: true,
  saving: false,
  feedback: null,
};

export const profileFeature = createFeature({
  name: 'profile',
  reducer: createReducer(
    initialState,
    on(ProfileActions.loadProfile, state => ({
      ...state,
      loading: true,
      feedback: null,
    })),
    on(ProfileActions.loadProfileSuccess, (state, { profile }) => ({
      ...state,
      profile,
      loading: false,
    })),
    on(ProfileActions.loadProfileFailure, state => ({
      ...state,
      loading: false,
      feedback: { kind: 'load-failed' },
    })),
    on(ProfileActions.updateDraft, (state, { patch }) => ({
      ...state,
      profile: {
        ...state.profile,
        ...patch,
      },
    })),
    on(ProfileActions.saveProfile, state => ({
      ...state,
      saving: true,
      feedback: null,
    })),
    on(ProfileActions.saveProfileSuccess, (state, { profile }) => ({
      ...state,
      profile,
      saving: false,
      feedback: { kind: 'saved' },
    })),
    on(ProfileActions.saveProfileFailure, state => ({
      ...state,
      saving: false,
      feedback: { kind: 'save-failed' },
    })),
    on(ProfileActions.setFeedback, (state, { feedback }) => ({
      ...state,
      feedback,
    })),
    on(ProfileActions.consumeFeedback, state => ({
      ...state,
      feedback: null,
    })),
  ),
});
