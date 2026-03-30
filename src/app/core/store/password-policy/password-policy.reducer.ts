import { createFeature, createReducer, on } from '@ngrx/store';
import { PasswordPolicyActions } from './password-policy.actions';
import { PasswordPolicyFeedback, PasswordPolicyModel } from './password-policy.models';

export interface PasswordPolicyState {
  policy: PasswordPolicyModel;
  loading: boolean;
  saving: boolean;
  feedback: PasswordPolicyFeedback | null;
}

const defaultPolicy: PasswordPolicyModel = {
  minLength: 8,
  requireDigit: false,
  requireUppercase: false,
  requireNonAlphanumeric: false,
  maxAgeDays: 0,
  historyCount: 0,
  checkBreachedPasswords: false,
  refreshTokenExpirationDays: 7,
};

const initialState: PasswordPolicyState = {
  policy: defaultPolicy,
  loading: true,
  saving: false,
  feedback: null,
};

export const passwordPolicyFeature = createFeature({
  name: 'passwordPolicy',
  reducer: createReducer(
    initialState,
    on(PasswordPolicyActions.loadPolicy, state => ({
      ...state,
      loading: true,
      feedback: null,
    })),
    on(PasswordPolicyActions.loadPolicySuccess, (state, { policy }) => ({
      ...state,
      policy,
      loading: false,
    })),
    on(PasswordPolicyActions.loadPolicyFailure, state => ({
      ...state,
      loading: false,
      feedback: { kind: 'load-failed' },
    })),
    on(PasswordPolicyActions.updateDraft, (state, { patch }) => ({
      ...state,
      policy: {
        ...state.policy,
        ...patch,
      },
    })),
    on(PasswordPolicyActions.savePolicy, state => ({
      ...state,
      saving: true,
      feedback: null,
    })),
    on(PasswordPolicyActions.savePolicySuccess, (state, { policy }) => ({
      ...state,
      policy,
      saving: false,
      feedback: { kind: 'saved' },
    })),
    on(PasswordPolicyActions.savePolicyFailure, state => ({
      ...state,
      saving: false,
      feedback: { kind: 'save-failed' },
    })),
    on(PasswordPolicyActions.setFeedback, (state, { feedback }) => ({
      ...state,
      feedback,
    })),
    on(PasswordPolicyActions.consumeFeedback, state => ({
      ...state,
      feedback: null,
    })),
  ),
});
