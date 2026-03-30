import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { RoleClaimDto } from './roles.models';

export const RolesActions = createActionGroup({
  source: 'Roles',
  events: {
    'Enter Page': emptyProps(),
    'Load Roles': emptyProps(),
    'Load Roles Success': props<{ roles: string[] }>(),
    'Load Roles Failure': emptyProps(),
    'Create Role': props<{ name: string }>(),
    'Create Role Success': props<{ role: string }>(),
    'Create Role Failure': props<{ errorKey: string }>(),
    'Delete Role': props<{ role: string }>(),
    'Delete Role Success': props<{ role: string }>(),
    'Delete Role Failure': props<{ errorKey: string }>(),
    'Open Claims Dialog': props<{ role: string }>(),
    'Close Claims Dialog': emptyProps(),
    'Load Claims Success': props<{ role: string; claims: RoleClaimDto[] }>(),
    'Load Claims Failure': props<{ errorKey: string }>(),
    'Add Claim': props<{ role: string; claimType: string; claimValue: string }>(),
    'Add Claim Success': props<{ role: string; claim: RoleClaimDto }>(),
    'Add Claim Failure': props<{ errorKey: string }>(),
    'Remove Claim': props<{ role: string; claim: RoleClaimDto }>(),
    'Remove Claim Success': props<{ role: string; claim: RoleClaimDto }>(),
    'Remove Claim Failure': props<{ errorKey: string }>(),
    'Clear Create Error': emptyProps(),
    'Clear Claims Error': emptyProps(),
    'Consume Feedback': emptyProps(),
  },
});
