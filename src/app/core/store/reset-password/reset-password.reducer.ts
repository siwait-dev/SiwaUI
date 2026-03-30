import { createFeature, createReducer, on } from '@ngrx/store';
import { ResetPasswordActions } from './reset-password.actions';
import { ResetPasswordFeedback } from './reset-password.models';

export interface ResetPasswordState {
  email: string;
  token: string;
  policyReady: boolean;
  loading: boolean;
  feedback: ResetPasswordFeedback | null;
}

const initialState: ResetPasswordState = {
  email: '',
  token: '',
  policyReady: false,
  loading: false,
  feedback: null,
};

export const resetPasswordFeature = createFeature({
  name: 'resetPassword',
  reducer: createReducer(
    initialState,
    on(ResetPasswordActions.setRequestContext, (state, { email, token }) => ({
      ...state,
      email,
      token,
    })),
    on(ResetPasswordActions.loadPolicy, state => ({
      ...state,
      policyReady: false,
      feedback: null,
    })),
    on(ResetPasswordActions.loadPolicySuccess, state => ({
      ...state,
      policyReady: true,
    })),
    on(ResetPasswordActions.loadPolicyFailure, state => ({
      ...state,
      policyReady: false,
      feedback: { kind: 'error', errorKey: 'VALIDATION.SERVER_ERROR' },
    })),
    on(ResetPasswordActions.submit, state => ({
      ...state,
      loading: true,
      feedback: null,
    })),
    on(ResetPasswordActions.submitSuccess, state => ({
      ...state,
      loading: false,
    })),
    on(ResetPasswordActions.submitFailure, (state, { errorKey }) => ({
      ...state,
      loading: false,
      feedback: { kind: 'error', errorKey },
    })),
    on(ResetPasswordActions.setFeedback, (state, { feedback }) => ({
      ...state,
      feedback,
    })),
    on(ResetPasswordActions.consumeFeedback, state => ({
      ...state,
      feedback: null,
    })),
  ),
});
