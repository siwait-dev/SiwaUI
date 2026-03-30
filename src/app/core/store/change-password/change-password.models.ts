export interface ChangePasswordFeedback {
  kind: 'success' | 'error';
  errorKey?: string;
}
