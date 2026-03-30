import { createFeature, createReducer, on } from '@ngrx/store';
import { ForgotPasswordActions } from './forgot-password.actions';
import { ForgotPasswordFeedback } from './forgot-password.models';

export interface ForgotPasswordState {
  loading: boolean;
  feedback: ForgotPasswordFeedback | null;
}

const initialState: ForgotPasswordState = {
  loading: false,
  feedback: null,
};

export const forgotPasswordFeature = createFeature({
  name: 'forgotPassword',
  reducer: createReducer(
    initialState,
    on(ForgotPasswordActions.submit, state => ({
      ...state,
      loading: true,
      feedback: null,
    })),
    on(ForgotPasswordActions.submitSuccess, state => ({
      ...state,
      loading: false,
      feedback: { kind: 'success' },
    })),
    on(ForgotPasswordActions.submitFailure, (state, { errorKey }) => ({
      ...state,
      loading: false,
      feedback: { kind: 'error', errorKey },
    })),
    on(ForgotPasswordActions.setFeedback, (state, { feedback }) => ({
      ...state,
      feedback,
    })),
    on(ForgotPasswordActions.consumeFeedback, state => ({
      ...state,
      feedback: null,
    })),
  ),
});
