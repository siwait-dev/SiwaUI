import { PasswordPolicy } from '../../services/password-policy.service';

export interface PasswordPolicyFeedback {
  kind: 'saved' | 'save-failed' | 'load-failed';
}

export type PasswordPolicyModel = PasswordPolicy;
