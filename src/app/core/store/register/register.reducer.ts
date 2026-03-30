import { createFeature, createReducer, on } from '@ngrx/store';
import { RegisterActions } from './register.actions';
import { RegisterFeedback } from './register.models';

export interface RegisterState {
  policyReady: boolean;
  loading: boolean;
  feedback: RegisterFeedback | null;
}

const initialState: RegisterState = {
  policyReady: false,
  loading: false,
  feedback: null,
};

export const registerFeature = createFeature({
  name: 'register',
  reducer: createReducer(
    initialState,
    on(RegisterActions.loadPolicy, state => ({
      ...state,
      policyReady: false,
      feedback: null,
    })),
    on(RegisterActions.loadPolicySuccess, state => ({
      ...state,
      policyReady: true,
    })),
    on(RegisterActions.loadPolicyFailure, state => ({
      ...state,
      policyReady: false,
      feedback: { kind: 'error', errorKey: 'VALIDATION.SERVER_ERROR' },
    })),
    on(RegisterActions.submit, state => ({
      ...state,
      loading: true,
      feedback: null,
    })),
    on(RegisterActions.submitSuccess, state => ({
      ...state,
      loading: false,
    })),
    on(RegisterActions.submitFailure, (state, { errorKey }) => ({
      ...state,
      loading: false,
      feedback: { kind: 'error', errorKey },
    })),
    on(RegisterActions.setFeedback, (state, { feedback }) => ({
      ...state,
      feedback,
    })),
    on(RegisterActions.consumeFeedback, state => ({
      ...state,
      feedback: null,
    })),
  ),
});
