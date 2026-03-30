export interface ForgotPasswordFeedback {
  kind: 'success' | 'error';
  errorKey?: string;
}
