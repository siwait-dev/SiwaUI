import { createFeature, createReducer, on } from '@ngrx/store';
import { RolesActions } from './roles.actions';
import { RoleClaimDto, RolesFeedback } from './roles.models';

export interface RolesState {
  roles: string[];
  loading: boolean;
  saving: boolean;
  createError: string | null;
  selectedRole: string | null;
  claims: RoleClaimDto[];
  claimsLoading: boolean;
  claimSaving: boolean;
  claimsError: string | null;
  deletingClaimKey: string | null;
  feedback: RolesFeedback | null;
}

const initialState: RolesState = {
  roles: [],
  loading: true,
  saving: false,
  createError: null,
  selectedRole: null,
  claims: [],
  claimsLoading: false,
  claimSaving: false,
  claimsError: null,
  deletingClaimKey: null,
  feedback: null,
};

function claimKey(claim: RoleClaimDto): string {
  return `${claim.type}::${claim.value}`;
}

export const rolesFeature = createFeature({
  name: 'roles',
  reducer: createReducer(
    initialState,
    on(RolesActions.loadRoles, state => ({ ...state, loading: true })),
    on(RolesActions.loadRolesSuccess, (state, { roles }) => ({
      ...state,
      roles,
      loading: false,
    })),
    on(RolesActions.loadRolesFailure, state => ({ ...state, loading: false })),
    on(RolesActions.createRole, state => ({
      ...state,
      saving: true,
      createError: null,
    })),
    on(RolesActions.createRoleSuccess, (state, { role }) => ({
      ...state,
      saving: false,
      roles: [...state.roles, role].sort((a, b) => a.localeCompare(b)),
      feedback: { kind: 'role-created', role },
    })),
    on(RolesActions.createRoleFailure, (state, { errorKey }) => ({
      ...state,
      saving: false,
      createError: errorKey,
    })),
    on(RolesActions.deleteRoleSuccess, (state, { role }) => ({
      ...state,
      roles: state.roles.filter(existing => existing !== role),
      feedback: { kind: 'role-deleted', role },
    })),
    on(RolesActions.deleteRoleFailure, (state, { errorKey }) => ({
      ...state,
      feedback: { kind: 'role-delete-failed', messageKey: errorKey },
    })),
    on(RolesActions.openClaimsDialog, (state, { role }) => ({
      ...state,
      selectedRole: role,
      claims: [],
      claimsLoading: true,
      claimsError: null,
      claimSaving: false,
      deletingClaimKey: null,
    })),
    on(RolesActions.closeClaimsDialog, state => ({
      ...state,
      selectedRole: null,
      claims: [],
      claimsLoading: false,
      claimSaving: false,
      claimsError: null,
      deletingClaimKey: null,
    })),
    on(RolesActions.loadClaimsSuccess, (state, { role, claims }) => ({
      ...state,
      selectedRole: role,
      claims,
      claimsLoading: false,
    })),
    on(RolesActions.loadClaimsFailure, (state, { errorKey }) => ({
      ...state,
      claimsLoading: false,
      claimsError: errorKey,
    })),
    on(RolesActions.addClaim, state => ({
      ...state,
      claimSaving: true,
      claimsError: null,
    })),
    on(RolesActions.addClaimSuccess, (state, { claim }) => ({
      ...state,
      claimSaving: false,
      claims: [...state.claims, claim],
      feedback: { kind: 'claim-added', claimKey: claimKey(claim) },
    })),
    on(RolesActions.addClaimFailure, (state, { errorKey }) => ({
      ...state,
      claimSaving: false,
      claimsError: errorKey,
    })),
    on(RolesActions.removeClaim, (state, { claim }) => ({
      ...state,
      deletingClaimKey: claimKey(claim),
      claimsError: null,
    })),
    on(RolesActions.removeClaimSuccess, (state, { claim }) => ({
      ...state,
      deletingClaimKey: null,
      claims: state.claims.filter(existing => claimKey(existing) !== claimKey(claim)),
      feedback: { kind: 'claim-removed', claimKey: claimKey(claim) },
    })),
    on(RolesActions.removeClaimFailure, (state, { errorKey }) => ({
      ...state,
      deletingClaimKey: null,
      claimsError: errorKey,
    })),
    on(RolesActions.clearCreateError, state => ({ ...state, createError: null })),
    on(RolesActions.clearClaimsError, state => ({ ...state, claimsError: null })),
    on(RolesActions.consumeFeedback, state => ({ ...state, feedback: null })),
  ),
});
