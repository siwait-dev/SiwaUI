import { computed, inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RolesActions } from './roles.actions';
import { RoleClaimDto } from './roles.models';
import {
  selectClaimSaving,
  selectClaims,
  selectClaimsError,
  selectClaimsLoading,
  selectCreateError,
  selectDeletingClaimKey,
  selectFeedback,
  selectLoading,
  selectRoles,
  selectSaving,
  selectSelectedRole,
} from './roles.selectors';

@Injectable({ providedIn: 'root' })
export class RolesFacade {
  private readonly store = inject(Store);

  readonly roles = this.store.selectSignal(selectRoles);
  readonly loading = this.store.selectSignal(selectLoading);
  readonly saving = this.store.selectSignal(selectSaving);
  readonly createError = this.store.selectSignal(selectCreateError);
  readonly selectedRole = this.store.selectSignal(selectSelectedRole);
  readonly claims = this.store.selectSignal(selectClaims);
  readonly claimsLoading = this.store.selectSignal(selectClaimsLoading);
  readonly claimSaving = this.store.selectSignal(selectClaimSaving);
  readonly claimsError = this.store.selectSignal(selectClaimsError);
  readonly deletingClaimKey = this.store.selectSignal(selectDeletingClaimKey);
  readonly feedback = this.store.selectSignal(selectFeedback);
  readonly hasClaimsDialogOpen = computed(() => !!this.selectedRole());

  enterPage(): void {
    this.store.dispatch(RolesActions.enterPage());
  }

  createRole(name: string): void {
    this.store.dispatch(RolesActions.createRole({ name }));
  }

  deleteRole(role: string): void {
    this.store.dispatch(RolesActions.deleteRole({ role }));
  }

  openClaimsDialog(role: string): void {
    this.store.dispatch(RolesActions.openClaimsDialog({ role }));
  }

  closeClaimsDialog(): void {
    this.store.dispatch(RolesActions.closeClaimsDialog());
  }

  addClaim(role: string, type: string, value: string): void {
    this.store.dispatch(RolesActions.addClaim({ role, claimType: type, claimValue: value }));
  }

  removeClaim(role: string, claim: RoleClaimDto): void {
    this.store.dispatch(RolesActions.removeClaim({ role, claim }));
  }

  clearCreateError(): void {
    this.store.dispatch(RolesActions.clearCreateError());
  }

  clearClaimsError(): void {
    this.store.dispatch(RolesActions.clearClaimsError());
  }

  consumeFeedback(): void {
    this.store.dispatch(RolesActions.consumeFeedback());
  }
}
