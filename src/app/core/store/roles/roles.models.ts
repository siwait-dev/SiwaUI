export interface RoleClaimDto {
  type: string;
  value: string;
}

export interface RoleClaimsResponse {
  claims: RoleClaimDto[];
}

export interface RolesFeedback {
  kind: 'role-created' | 'role-deleted' | 'role-delete-failed' | 'claim-added' | 'claim-removed';
  role?: string;
  claimKey?: string;
  messageKey?: string;
}
