import { createFeature, createReducer, on } from '@ngrx/store';
import { ActivateActions } from './activate.actions';
import { ActivateStatus } from './activate.models';

export interface ActivateState {
  status: ActivateStatus;
}

const initialState: ActivateState = {
  status: 'loading',
};

export const activateFeature = createFeature({
  name: 'activate',
  reducer: createReducer(
    initialState,
    on(ActivateActions.setNoParams, state => ({
      ...state,
      status: 'no-params',
    })),
    on(ActivateActions.submit, state => ({
      ...state,
      status: 'loading',
    })),
    on(ActivateActions.submitSuccess, state => ({
      ...state,
      status: 'success',
    })),
    on(ActivateActions.submitFailure, state => ({
      ...state,
      status: 'error',
    })),
  ),
});
