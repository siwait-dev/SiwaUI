import { createFeature, createReducer, on } from '@ngrx/store';
import { LoginActions } from './login.actions';
import { LoginFeedback } from './login.models';

export interface LoginState {
  loading: boolean;
  feedback: LoginFeedback | null;
}

const initialState: LoginState = {
  loading: false,
  feedback: null,
};

export const loginFeature = createFeature({
  name: 'login',
  reducer: createReducer(
    initialState,
    on(LoginActions.submit, state => ({
      ...state,
      loading: true,
      feedback: null,
    })),
    on(LoginActions.submitSuccess, state => ({
      ...state,
      loading: false,
    })),
    on(LoginActions.submitFailure, (state, { errorKey }) => ({
      ...state,
      loading: false,
      feedback: { kind: 'error', errorKey },
    })),
    on(LoginActions.setFeedback, (state, { feedback }) => ({
      ...state,
      feedback,
    })),
    on(LoginActions.consumeFeedback, state => ({
      ...state,
      feedback: null,
    })),
  ),
});
