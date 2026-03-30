import { createFeature, createReducer, on } from '@ngrx/store';
import { ChangePasswordActions } from './change-password.actions';
import { ChangePasswordFeedback } from './change-password.models';

export interface ChangePasswordState {
  policyReady: boolean;
  loading: boolean;
  feedback: ChangePasswordFeedback | null;
}

const initialState: ChangePasswordState = {
  policyReady: false,
  loading: false,
  feedback: null,
};

export const changePasswordFeature = createFeature({
  name: 'changePassword',
  reducer: createReducer(
    initialState,
    on(ChangePasswordActions.loadPolicy, state => ({
      ...state,
      policyReady: false,
      feedback: null,
    })),
    on(ChangePasswordActions.loadPolicySuccess, state => ({
      ...state,
      policyReady: true,
    })),
    on(ChangePasswordActions.loadPolicyFailure, state => ({
      ...state,
      policyReady: false,
      feedback: { kind: 'error', errorKey: 'VALIDATION.SERVER_ERROR' },
    })),
    on(ChangePasswordActions.submit, state => ({
      ...state,
      loading: true,
      feedback: null,
    })),
    on(ChangePasswordActions.submitSuccess, state => ({
      ...state,
      loading: false,
      feedback: { kind: 'success' },
    })),
    on(ChangePasswordActions.submitFailure, (state, { errorKey }) => ({
      ...state,
      loading: false,
      feedback: { kind: 'error', errorKey },
    })),
    on(ChangePasswordActions.setFeedback, (state, { feedback }) => ({
      ...state,
      feedback,
    })),
    on(ChangePasswordActions.consumeFeedback, state => ({
      ...state,
      feedback: null,
    })),
  ),
});
